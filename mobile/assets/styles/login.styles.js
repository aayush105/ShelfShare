import { StyleSheet } from "react-native";
import COLORS from "../../constants/colors";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },

  illustrationContainer: {
    alignItems: "center",
    marginBottom: 10,
  },
  illustrationImage: {
    width: 200,
    height: 200,
  },
  title: {
    fontSize: 28,
    fontFamily: "JetBrainsMono-Medium",
    color: COLORS.primary,
    // marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.secondary,
  },
  card: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  formContainer: {
    alignItems: "center",
  },
  inputGroup: {
    width: "100%",
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: COLORS.text,
  },
  eyeIcon: {
    padding: 5,
  },
  button: {
    width: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  footerText: {
    color: COLORS.text,
    fontSize: 14,
  },
  link: {
    color: COLORS.primary,
    fontSize: 14,
    marginLeft: 5,
    fontWeight: "bold",
  },
});
