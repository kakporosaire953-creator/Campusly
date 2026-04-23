# 🔒 Instructions pour Push GitHub

## ⚠️ Problème Détecté

GitHub a bloqué le push car il a détecté une clé API Groq dans les anciens commits.

## ✅ Solution

### Option 1: Autoriser le Secret (Recommandé)

1. Cliquer sur ce lien:
   ```
   https://github.com/kakporosaire953-creator/Campusly/security/secret-scanning/unblock-secret/3CkcMks6ia6uz3nZJPrasJwf8Dz
   ```

2. Cliquer sur "Allow secret"

3. Réessayer le push:
   ```bash
   git push origin main
   ```

### Option 2: Nettoyer l'Historique Git (Avancé)

Si vous voulez supprimer complètement la clé de l'historique:

```bash
# ATTENTION: Ceci réécrit l'historique Git!

# 1. Installer git-filter-repo
pip install git-filter-repo

# 2. Créer un fichier avec les secrets à supprimer
echo "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" > secrets.txt

# 3. Nettoyer l'historique
git filter-repo --replace-text secrets.txt

# 4. Force push
git push origin main --force
```

### Option 3: Créer une Nouvelle Branche

```bash
# 1. Créer une nouvelle branche sans l'historique problématique
git checkout --orphan main-clean

# 2. Ajouter tous les fichiers
git add .

# 3. Commit
git commit -m "🚀 Campusly - Version complète et sécurisée"

# 4. Supprimer l'ancienne branche main
git branch -D main

# 5. Renommer la nouvelle branche
git branch -m main

# 6. Force push
git push origin main --force
```

## 📝 Note Importante

La clé API Groq exposée dans les commits est:
```
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
```

**Actions recommandées:**

1. ✅ Révoquer cette clé dans Groq Console
2. ✅ Générer une nouvelle clé
3. ✅ Configurer la nouvelle clé dans Supabase Secrets
4. ✅ Ne JAMAIS committer de clés API dans le code

## 🔐 Bonnes Pratiques

### Où Stocker les Clés API

✅ **BON:**
- Supabase Secrets (Edge Functions)
- Variables d'environnement (.env)
- Gestionnaires de secrets (Vault, AWS Secrets Manager)

❌ **MAUVAIS:**
- Code source
- Fichiers de configuration committé
- Documentation
- README

### Fichiers à Ignorer

Ajouter dans `.gitignore`:

```
# Secrets
.env
.env.local
.env.production
secrets.txt
config/secrets.js

# Supabase
.supabase/
supabase/.temp/

# Logs
*.log
npm-debug.log*
```

## ✅ Vérification Finale

Après avoir résolu le problème:

```bash
# 1. Vérifier qu'il n'y a plus de secrets
git log --all --full-history --source --pretty=format: -- | grep -i "gsk_"

# 2. Push
git push origin main

# 3. Vérifier sur GitHub
# Aller sur https://github.com/kakporosaire953-creator/Campusly
```

## 📞 Besoin d'Aide?

- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [Git Filter Repo](https://github.com/newren/git-filter-repo)
- [Groq API Keys](https://console.groq.com/keys)

---

**Date**: 23 Avril 2026  
**Statut**: En attente de résolution
