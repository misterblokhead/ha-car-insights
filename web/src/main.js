import { mount } from "svelte";
import "./lib/tokens.css";
import "./lib/base.css";
import App from "./App.svelte";

export const mountApp = (target) => mount(App, { target });
