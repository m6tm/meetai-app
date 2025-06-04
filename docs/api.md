# Documentation Technique de l'API

Cette documentation décrit les endpoints de l'API de l'application, incluant les méthodes HTTP, les paramètres, les schémas de requête et réponse, l'authentification et les réponses d'erreur possibles.

## Endpoints

### `GET /api`

**Description :** Endpoint de base sans fonctionnalité spécifique.

**Méthode HTTP :** `GET`

**Paramètres :** Aucun

**Schéma de Requête :** Aucun

**Schéma de Réponse :**

```json
{
    "code": 200,
    "message": "Nothing"
}
```

**Authentification :** Aucune requise.

**Réponses d'Erreur Possibles :** Aucune définie explicitement dans le code.

### `GET /api/meet/my-meetings`

**Description :** Récupère la liste des réunions auxquelles l'utilisateur authentifié participe.

**Méthode HTTP :** `GET`

**Paramètres :** Aucun

**Schéma de Requête :** Aucun

**Schéma de Réponse :**

```json
{
  "error": null | string,
  "data": Array<Meeting> | null, // Structure détaillée de l'objet Meeting non disponible sans le schéma Prisma
  "code": 200 | 401
}
```

**Authentification :** Requiert une session utilisateur valide.

**Réponses d'Erreur Possibles :**

- `401 Unauthorized`: Si aucune session utilisateur n'est trouvée.

### `POST /api/meet/remove-participant`

**Description :** Supprime un participant d'une réunion spécifique.

**Méthode HTTP :** `POST`

**Paramètres (via `formData`) :**

- `room_code` (string, requis) : Le code de la salle de réunion.
- `participant_identity` (string, requis) : L'identifiant du participant à supprimer.
- `role` (string, requis) : Le rôle de l'utilisateur effectuant la requête (`admin` ou `moderator` requis pour l'autorisation).

**Schéma de Requête :** `multipart/form-data` avec les champs `room_code`, `participant_identity`, et `role`.

**Schéma de Réponse :**

```json
{
  "error": null | string,
  "data": null,
  "code": 200 | 400 | 403 | 500
}
```

**Authentification :** L'utilisateur effectuant la requête doit avoir le rôle `admin` ou `moderator`.

**Réponses d'Erreur Possibles :**

- `400 Bad Request`: Si les champs requis (`room_code`, `participant_identity`, `role`) sont manquants.
- `403 Forbidden`: Si l'utilisateur n'a pas les autorisations nécessaires (`admin` ou `moderator`).
- `500 Internal Server Error`: Si la suppression du participant échoue via le service LiveKit.

### `POST /api/seed`

**Description :** Initialise la base de données avec des données de test (utilisateurs, plans, abonnements). Ne s'exécute que si aucun utilisateur n'existe déjà.

**Méthode HTTP :** `POST`

**Paramètres :** Aucun

**Schéma de Requête :** Aucun

**Schéma de Réponse :**

```json
{
  "error": null | string,
  "data": "Seed completed" | null,
  "code": 200 | 400
}
```

**Authentification :** Aucune requise.

**Réponses d'Erreur Possibles :**

- `400 Bad Request`: Si le seed a déjà été exécuté (un utilisateur existe déjà).

### `GET /api/seed`

**Description :** Récupère la liste de tous les utilisateurs avec leurs abonnements et la liste de tous les plans disponibles.

**Méthode HTTP :** `GET`

**Paramètres :** Aucun

**Schéma de Requête :** Aucun

**Schéma de Réponse :**

```json
{
  "error": null,
  "data": {
    "users": Array<User>, // Structure détaillée de l'objet User non disponible sans le schéma Prisma
    "plans": Array<Plan> // Structure détaillée de l'objet Plan non disponible sans le schéma Prisma
  },
  "code": 200
}
```

**Authentification :** Aucune requise.

**Réponses d'Erreur Possibles :** Aucune définie explicitement dans le code.

---

**Note :** Les structures détaillées des objets `Meeting`, `User`, et `Plan` dépendent du schéma Prisma (`prisma/schema.prisma`) et ne sont pas entièrement déduites de l'analyse des fichiers de route seuls. Pour une documentation complète, il serait nécessaire d'analyser également le schéma Prisma.
