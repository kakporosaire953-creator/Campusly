// ============================================================
// CAMPUSLY — Tests de propriété : Firestore (isolation + accès premium)
// Feature: campusly-mvp
// Utilise @firebase/rules-unit-testing + émulateur Firestore
// ============================================================
// Pour lancer : firebase emulators:start --only firestore
// puis : npm test (dans functions/)
// ============================================================

const fc = require("fast-check");
const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require("@firebase/rules-unit-testing");
const { readFileSync } = require("fs");
const { resolve }      = require("path");

let testEnv;

// ============================================================
// SETUP
// ============================================================
beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "campusly-test",
    firestore: {
      rules: readFileSync(resolve(__dirname, "../../firestore.rules"), "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv.cleanup();
});

afterEach(async () => {
  await testEnv.clearFirestore();
});

// ============================================================
// HELPERS
// ============================================================
function userContext(uid) {
  return testEnv.authenticatedContext(uid);
}

function anonContext() {
  return testEnv.unauthenticatedContext();
}

async function seedUserProfile(uid, data = {}) {
  await testEnv.withSecurityRulesDisabled(async ctx => {
    await ctx.firestore().collection("users").doc(uid).set({
      uid,
      matricule: "10851326",
      prenom: "Test",
      nom: "User",
      isPremium: false,
      premiumExpiry: null,
      ...data,
    });
  });
}

async function seedEpreuve(id, isPremium = false) {
  await testEnv.withSecurityRulesDisabled(async ctx => {
    await ctx.firestore().collection("epreuves").doc(id).set({
      titre: `Épreuve ${id}`,
      faculte: "FAST",
      isPremium,
      dateAjout: new Date(),
    });
  });
}

// ============================================================
// Property 3 : Isolation des données utilisateur
// Feature: campusly-mvp, Property 3: Isolation des données
// Validates: Requirements 2.4, 6.2
// ============================================================
describe("Property 3 — Isolation des données utilisateur", () => {
  test(
    "Pour tout utilisateur A, il ne peut pas lire le profil d'un utilisateur B",
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), fc.uuid(),
          async (uidA, uidB) => {
            if (uidA === uidB) return true; // skip si même uid

            await seedUserProfile(uidA);
            await seedUserProfile(uidB);

            const ctxA = userContext(uidA);
            // A peut lire son propre profil
            await assertSucceeds(ctxA.firestore().collection("users").doc(uidA).get());
            // A ne peut pas lire le profil de B
            await assertFails(ctxA.firestore().collection("users").doc(uidB).get());
            return true;
          }
        ),
        { numRuns: 20 }
      );
    },
    60000
  );

  test("Un utilisateur non authentifié ne peut pas lire les profils", async () => {
    const uid = "user-anon-test";
    await seedUserProfile(uid);
    const ctx = anonContext();
    await assertFails(ctx.firestore().collection("users").doc(uid).get());
  });

  test(
    "Pour tout utilisateur, il ne peut pas modifier le profil d'un autre",
    async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.uuid(), fc.uuid(),
          async (uidA, uidB) => {
            if (uidA === uidB) return true;

            await seedUserProfile(uidA);
            await seedUserProfile(uidB);

            const ctxA = userContext(uidA);
            await assertFails(
              ctxA.firestore().collection("users").doc(uidB).update({ prenom: "Hacker" })
            );
            return true;
          }
        ),
        { numRuns: 20 }
      );
    },
    60000
  );
});

// ============================================================
// Property 6 : Accès aux épreuves — authentification requise
// Feature: campusly-mvp, Property 6: Accès premium aux épreuves
// Validates: Requirements 3.3, 6.2
// ============================================================
describe("Property 6 — Accès aux épreuves", () => {
  test("Un utilisateur authentifié peut lire les épreuves", async () => {
    const uid = "user-auth-test";
    await seedUserProfile(uid);
    await seedEpreuve("ep-free", false);

    const ctx = userContext(uid);
    await assertSucceeds(ctx.firestore().collection("epreuves").doc("ep-free").get());
  });

  test("Un utilisateur non authentifié ne peut pas lire les épreuves", async () => {
    await seedEpreuve("ep-anon", false);
    const ctx = anonContext();
    await assertFails(ctx.firestore().collection("epreuves").doc("ep-anon").get());
  });

  test(
    "Pour tout utilisateur authentifié, il ne peut pas écrire dans les épreuves",
    async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), async (uid) => {
          await seedUserProfile(uid);
          const ctx = userContext(uid);
          await assertFails(
            ctx.firestore().collection("epreuves").doc("new-ep").set({
              titre: "Épreuve piratée",
              isPremium: false,
            })
          );
          return true;
        }),
        { numRuns: 15 }
      );
    },
    60000
  );

  test("Les transactions ne peuvent pas être écrites par un client", async () => {
    const uid = "user-tx-test";
    await seedUserProfile(uid);
    const ctx = userContext(uid);
    await assertFails(
      ctx.firestore().collection("transactions").add({
        userId: uid,
        amount: 1500,
        status: "success",
      })
    );
  });
});
