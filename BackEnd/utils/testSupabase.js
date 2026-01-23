import supabase from "./supabase.js";

const test = async () => {
  const { data, error } = await supabase
    .from("health_check")
    .select("*");

  if (error) {
    console.error("❌ Supabase error:", error);
  } else {
    console.log("✅ Supabase connected successfully");
    console.log(data);
  }
};

test();
