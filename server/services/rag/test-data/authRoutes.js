router.post("/register", register);

router.post("/login", login);

router.get("/profile", protect, getProfile);