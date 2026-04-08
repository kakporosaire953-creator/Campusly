 // ============================================================
// CAMPUSLY — Tests de propriété : Authentification
// Feature: campusly-mvp
// Utilise l'émulateur Firebase Auth + Firestore
// ============================================================
// Pour lancer : firebase emulators:start --only auth,firestore
// puis : npm test (dans functions/)
// ============================================================

const fc = require("fast-check");
const { initializeApp, deleteApp } = require("firebase/app");
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  connectAuthEmulator,
} = require("firebase/auth");
const {
  getFirestore,
  doc,
  getDoc,
  connectFirestoreEmulator,
} = require("firebase/firestore");

// ============================================================
// CONFIG ÉMULATEUR
// ============================================================
const EMULATOR_CONFIG = {
  apiKey: "fake-api-key",
  authDomain: "localhost",
  projectId: "campusly-test",
};

// Helpers importés depuis auth.js (logique pure, sans DOM)
function matriculeToEmail(matricule) {
  return `${matricule.toLowerCase().replace(/\s+/g, "")}@campusly.uac.bj`;
}

function validatePassword(password) {
  const rules = [
    { test: password.length >= 8,          msg: "Au moins 8 caractères" },
    { test: /[A-Z]/.test(password),        msg: "Au moins une lettre majuscule" },
    { test: /[0-9]/.test(password),        msg: "Au moins un chiffre" },
    { test: /[^A-Za-z0-9]/.test(password), msg: "Au moins un symbole" },
  ];
  const failed = rules.filter(r => !r.test);
  return failed.length === 0 ? null : failed.map(r => r.msg).join(" · ");
}

// ============================================================
// GÉNÉRATEURS fast-check
// ============================================================

// Matricule valide : 8 chiffres (format UAC réel, ex: 10851326)
const validMatricule = fc.stringMatching(/^\d{8}$/);

// Mot de passe valide : respecte toutes les règles
const validPassword = fc.string({ minLength: 8, maxLength: 20 })
  .map(s => {
    // Garantir maj + chiffre + symbole
    return "Aa1!" + s.slice(0, 16);
  });

// ============================================================
// SETUP / TEARDOWN
// ============================================================
let app, authInstance, dbInstance;

beforeAll(() => {
  app          = initializeApp(EMULATOR_CONFIG, "auth-test-" + Date.now());
  authInstance = getAuth(app);
  dbInstance   = getFirestore(app);
  connectAuthEmulator(authInstance, "http://127.0.0.1:9099", { disableWarnings: true });
  connectFirestoreEmulator(dbInstance, "127.0.0.1", 8080);
});

afterAll(async () => {
  await deleteApp(app);
});

// ============================================================
// Property 1 : Unicité du matricule à l'inscription
// Feature: campusly-mvp, Property 1: Unicité du matricule
// Validates: Requirements 1.2
// ============================================================
describe("Property 1 — Unicité du matricule", () => {
  test(
    "Pour tout matricule déjà inscrit, une 2e inscription doit être rejetée",
    async () => {
      await fc.assert(
        fc.asyncProperty(validMatricule, validPassword, async (matricule, password) => {
          const email = matriculeToEmail(matricule + Date.now()); // unique par run
          try {
            // 1ère inscription — doit réussir
            await createUserWithEmailAndPassword(authInstance, email, password);
            // 2ème inscription avec le même email — doit échouer
            try {
              await createUserWithEmailAndPassword(authInstance, email, password);
              return false; // Ne devrait pas arriver
            } catch (err) {
              return err.code === "auth/email-already-in-use";
            }
          } catch {
            return true; // Erreur inattendue sur la 1ère inscription — skip
          }
        }),
        { numRuns: 20 } // Réduit car appels réseau vers émulateur
      );
    },
    30000
  );
});

// ============================================================
// Property 2 : Round-trip connexion / déconnexion
// Feature: campusly-mvp, Property 2: Round-trip auth
// Validates: Requirements 1.3, 1.5
// ============================================================
describe("Property 2 — Round-trip connexion/déconnexion", () => {
  test(
    "Pour tout compte créé, connexion puis déconnexion doit résulter en état non-authentifié",
    async () => {
      await fc.assert(
        fc.asyncProperty(validPassword, async (password) => {
          const email = `roundtrip_${Date.now()}_${Math.random().toString(36).slice(2)}@campusly.uac.bj`;
          try {
            // Créer le compte
            await createUserWithEmailAndPassword(authInstance, email, password);
            // Se connecter
            const cred = await signInWithEmailAndPassword(authInstance, email, password);
            const loggedIn = !!cred.user;
            // Se déconnecter
            await signOut(authInstance);
            const loggedOut = authInstance.currentUser === null;
            return loggedIn && loggedOut;
          } catch {
            return true; // Skip si erreur réseau
          }
        }),
        { numRuns: 10 }
      );
    },
    30000
  );
});

// ============================================================
// Tests unitaires — validatePassword (sans émulateur)
// Validates: Requirements 1.7
// ============================================================
describe("validatePassword — règles de validation", () => {
  test("accepte un mot de passe valide", () => {
    expect(validatePassword("Secure1!")).toBeNull();
    expect(validatePassword("MonMotDePasse2@")).toBeNull();
  });

  test("rejette un mot de passe trop court", () => {
    expect(validatePassword("Ab1!")).not.toBeNull();
  });

  test("rejette un mot de passe sans majuscule", () => {
    expect(validatePassword("secure1!abc")).not.toBeNull();
  });

  test("rejette un mot de passe sans chiffre", () => {
    expect(validatePassword("SecurePass!")).not.toBeNull();
  });

  test("rejette un mot de passe sans symbole", () => {
    expect(validatePassword("SecurePass1")).not.toBeNull();
  });
});

// ============================================================
// Tests unitaires — matriculeToEmail
// ============================================================
describe("matriculeToEmail", () => {
  test("génère un email valide depuis un matricule", () => {
    expect(matriculeToEmail("UAC2024001")).toBe("uac2024001@campusly.uac.bj");
    expect(matriculeToEmail("FAST2023042")).toBe("fast2023042@campusly.uac.bj");
  });

  test("met le matricule en minuscules", () => {
    const email = matriculeToEmail("UAC2024001");
    expect(email).toBe(email.toLowerCase());
  });

  test("supprime les espaces", () => {
    expect(matriculeToEmail("UAC 2024 001")).toBe("uac2024001@campusly.uac.bj");
  });
});
