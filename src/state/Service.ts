

export const handleLogin = async (phone: string, email: string, name: string, password: string) => {
  if (!phone || !email || !name || !password) {
    throw new Error("Please fill in all fields.");
  }

  const response = await fetch("https://f64c-2400-adc5-124-2500-14f7-6e9b-1fa6-9b49.ngrok-free.app/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      phone,
      email,
      name,
      password,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed. Please try again.");
  }

  const data = await response.json();
  return data; // { message, accessToken, customer }
};
