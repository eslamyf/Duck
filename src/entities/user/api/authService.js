const USERS_KEY = "duck_users";
const CURRENT_USER_KEY = "duck_current_user";
const SESSION_USER_KEY = "duck_session_user";

// Get all registered users
const getAllUsers = () => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
};

// Save registered users
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Hash password for this frontend demo
const hashPassword = async (password) => {
  if (!globalThis.crypto?.subtle) {
    throw new Error("SECURE_CRYPTO_UNAVAILABLE");
  }

  const encodedPassword = new TextEncoder().encode(password);

  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    encodedPassword
  );

  return Array.from(new Uint8Array(hashBuffer))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

// Create a new account
export const registerUser = async ({
  fullName,
  email,
  phone,
  password,
}) => {
  const users = getAllUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = users.find(
    (user) => user.email === normalizedEmail
  );

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const newUser = {
    id: crypto.randomUUID(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    phone: phone.trim(),
    passwordHash: await hashPassword(password),
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveUsers(users);

  const { passwordHash, ...safeUser } = newUser;

  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(safeUser)
  );

  return safeUser;
};

// Login
export const loginUser = async ({
  email,
  password,
  rememberMe = true,
}) => {
  const users = getAllUsers();
  const normalizedEmail = email.trim().toLowerCase();

  const user = users.find(
    (item) => item.email === normalizedEmail
  );

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordHash = await hashPassword(password);

  if (user.passwordHash !== passwordHash) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const { passwordHash: ignored, ...safeUser } = user;

  // Clear previous session
  localStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);

  if (rememberMe) {
    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify(safeUser)
    );
  } else {
    sessionStorage.setItem(
      SESSION_USER_KEY,
      JSON.stringify(safeUser)
    );
  }

  return safeUser;
};

// Get current logged-in user
export const getCurrentUser = () => {
  try {
    const user =
      sessionStorage.getItem(SESSION_USER_KEY) ||
      localStorage.getItem(CURRENT_USER_KEY);

    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(SESSION_USER_KEY);
};

// Update current user's profile
export const updateCurrentUser = (updates) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    throw new Error("USER_NOT_LOGGED_IN");
  }

  const users = getAllUsers();

  const updatedUsers = users.map((user) =>
    user.id === currentUser.id
      ? { ...user, ...updates, id: user.id }
      : user
  );

  saveUsers(updatedUsers);

  const updatedUser = {
    ...currentUser,
    ...updates,
    id: currentUser.id,
  };

  const storage = sessionStorage.getItem(SESSION_USER_KEY)
    ? sessionStorage
    : localStorage;

  storage.setItem(
    storage === sessionStorage
      ? SESSION_USER_KEY
      : CURRENT_USER_KEY,
    JSON.stringify(updatedUser)
  );

  return updatedUser;
};
