# HomeBite Database Design

This document describes the current backend collection design. The project uses MongoDB Native Driver, not Mongoose.

## users

Stores application user data after Firebase authentication.

### Chef status field

The previous `chefVerified` field is replaced by `chefStatus`.

Allowed values:

- `none`: User has not applied to become a chef.
- `pending`: User submitted a chef application and it is waiting for review.
- `approved`: User has been approved as a chef.
- `rejected`: User submitted a chef application and it was rejected.

### User document shape

```js
{
  _id: ObjectId,
  name: String,
  email: String,
  photo: String,
  firebaseUid: String,
  role: 'customer' | 'chef' | 'admin',
  status: 'active' | 'blocked',
  chefStatus: 'none' | 'pending' | 'approved' | 'rejected',
  createdAt: Date,
  lastLogin: Date
}
```

## chefApplications

Stores applications from users who want to become chefs.

### Chef application document shape

```js
{
  _id: ObjectId,
  userId: ObjectId,
  firebaseUid: String,
  name: String,
  email: String,
  phone: String,
  location: String,
  experience: String,
  specialties: String[],
  bio: String,
  documents: String[],
  status: 'pending' | 'approved' | 'rejected',
  rejectionReason: String,
  submittedAt: Date,
  reviewedAt: Date,
  reviewedBy: ObjectId
}
```

### Field explanation

- `_id`: MongoDB document id for the application.
- `userId`: Reference to the related user in the `users` collection.
- `firebaseUid`: Firebase auth uid for quick lookup.
- `name`: Applicant display name at submission time.
- `email`: Applicant email at submission time.
- `phone`: Contact phone number for review or verification.
- `location`: Applicant service area or address summary.
- `experience`: Short description of cooking or food-service experience.
- `specialties`: List of cuisines, dishes, or food categories the applicant offers.
- `bio`: Applicant introduction shown or reviewed during onboarding.
- `documents`: Uploaded verification document URLs or file references.
- `status`: Review state of the application.
- `rejectionReason`: Optional reason when an application is rejected.
- `submittedAt`: Date the application was submitted.
- `reviewedAt`: Date an admin reviewed the application.
- `reviewedBy`: Admin user id that reviewed the application.
