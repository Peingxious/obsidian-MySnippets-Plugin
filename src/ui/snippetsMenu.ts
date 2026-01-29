import type MySnippetsPlugin from "src/plugin/main";
import { MySnippetsSettings } from "src/settings/settingsData";
import { EnhancedApp } from "src/settings/type";
import { setupMenu } from "./menu/MenuManager";
import { createSnippetItem } from "./menu/SnippetItem";
import { createMenuActions } from "./menu/MenuActions";

export default function snippetsMenu(
  app: EnhancedApp,
  plugin: MySnippetsPlugin,
  settings: MySnippetsSettings,
) {
  const windowX = window.innerWidth;
  const windowY = window.innerHeight;
  const menuExists = document.querySelector(".menu.MySnippets-statusbar-menu");

  if (!menuExists) {
    const menu = setupMenu(settings);

    const customCss = app.customCss;
    const currentSnippets = customCss.snippets;
    const snippetsFolder = customCss.getSnippetsFolder();

    currentSnippets.forEach((snippet: string) => {
      createSnippetItem(menu, app, snippet, customCss);
    });

    menu.addSeparator();

    createMenuActions(menu, app, plugin, snippetsFolder, customCss);

    const event = window.event as MouseEvent;
    if (event) {
      // @ts-ignore
      if (menu.showAtMouseEvent) {
        // @ts-ignore
        menu.showAtMouseEvent(event);
      } else {
        menu.showAtPosition({
          x: windowX - 15,
          y: windowY - 37,
        });
      }
    } else {
      menu.showAtPosition({
        x: windowX - 15,
        y: windowY - 37,
        });
    }
  }
}
