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

## foods

Stores food listings created by approved chefs. Because the backend uses the MongoDB Native Driver, this is a document contract rather than a Mongoose model.

### Food document shape

```js
{
  _id: ObjectId,

  chefId: ObjectId,
  chefName: String,
  chefEmail: String,
  chefPhoto: String,

  title: String,
  slug: String,
  shortDescription: String,
  description: String,

  category: String,
  cuisine: String,
  ingredients: String[],

  price: Number,
  discountPrice: Number | null,

  thumbnail: String,
  gallery: String[],

  preparationTime: Number,
  servingSize: Number,
  calories: Number,
  spiceLevel: String,
  tags: String[],

  availableQuantity: Number,
  isAvailable: Boolean, // default: true

  rating: Number,       // default: 0
  reviewCount: Number,  // default: 0
  orderCount: Number,   // default: 0

  status: 'active' | 'archived' | 'deleted', // default: 'active'

  createdAt: Date,
  updatedAt: Date
}
```

### Field explanation

- `_id`: MongoDB-generated unique identifier for the food document.
- `chefId`: Reference to the chef's document in the `users` collection. Store this as an `ObjectId`.
- `chefName`: Snapshot of the chef's display name for the listing.
- `chefEmail`: Snapshot of the chef's email address for identification and lookup.
- `chefPhoto`: Snapshot of the chef's profile-photo URL; use an empty string when no photo exists.
- `title`: Customer-facing name of the food item.
- `slug`: URL-safe, normalized identifier derived from the title. It should be unique among food listings.
- `shortDescription`: Brief summary suitable for food cards and search results.
- `description`: Full description of the dish, including details that do not belong in the ingredients list.
- `category`: Broad grouping for the item, such as breakfast, lunch, dinner, dessert, or snacks.
- `cuisine`: Culinary style or regional origin, such as Bangladeshi, Indian, Italian, or Chinese.
- `ingredients`: Array of ingredient names or short ingredient descriptions. Use an empty array when none are supplied.
- `price`: Regular unit price stored as a non-negative number in the application's chosen currency.
- `discountPrice`: Optional discounted unit price. Store `null` when there is no discount; when present, it should be non-negative and lower than `price`.
- `thumbnail`: Primary image URL used in listing cards and previews.
- `gallery`: Array of additional food-image URLs. Use an empty array when there are no additional images.
- `preparationTime`: Estimated preparation time in minutes, stored as a non-negative number.
- `servingSize`: Number of people or portions served by one unit, stored as a positive number.
- `calories`: Estimated calories per serving, stored as a non-negative number.
- `spiceLevel`: Human-readable spice classification, such as `mild`, `medium`, or `hot`.
- `tags`: Array of normalized search and discovery labels, such as `halal`, `vegan`, or `gluten-free`.
- `availableQuantity`: Current number of units available to order, stored as a non-negative integer.
- `isAvailable`: Whether customers may currently order the item. Defaults to `true`; inventory logic may set it to `false` when unavailable.
- `rating`: Aggregate customer rating for the item. Defaults to `0` before any reviews exist.
- `reviewCount`: Number of reviews included in the aggregate rating. Defaults to `0`.
- `orderCount`: Number of orders recorded for the item. Defaults to `0`.
- `status`: Lifecycle state of the listing. `active` means usable and visible subject to availability, `archived` means retained but withdrawn, and `deleted` represents a soft-deleted record. Defaults to `active`.
- `createdAt`: Date and time the food document was first created. Set it with `new Date()` on insertion.
- `updatedAt`: Date and time the food document was last changed. Initially equal to `createdAt` and refreshed on every update.

### Default values for insertion

```js
{
  ingredients: [],
  discountPrice: null,
  gallery: [],
  tags: [],
  isAvailable: true,
  rating: 0,
  reviewCount: 0,
  orderCount: 0,
  status: 'active',
  createdAt: new Date(),
  updatedAt: new Date()
}
```
