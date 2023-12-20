import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify";
import router from "./router";
import store from "./store";
import Axios from "axios";
import VueCookies from "vue-cookies";

const app = createApp(App);

app.use(router);
app.use(vuetify);
app.use(store);
app.use(VueCookies, {
  expires: "60 * 60",
});
app.provide("$axios", Axios);

app.mount("#app");
