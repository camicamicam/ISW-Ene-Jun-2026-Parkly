import { router } from "../../routes/router.js";
import { Navbar } from "../../components/navbar.js";

document.getElementById("navbar").innerHTML = Navbar();

window.addEventListener("popstate", router);

router();