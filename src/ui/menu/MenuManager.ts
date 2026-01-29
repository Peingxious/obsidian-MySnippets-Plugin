import { Menu } from "obsidian";
import { EnhancedMenu } from "src/settings/type";
import { MySnippetsSettings } from "src/settings/settingsData";

export function setupMenu(settings: MySnippetsSettings): EnhancedMenu {
  const menu = new Menu() as unknown as EnhancedMenu;
  menu.setUseNativeMenu(false);

  const menuDom = (menu as any).dom as HTMLElement;
  menuDom.addClass("MySnippets-statusbar-menu");

  let isClosing = false;
  let isMouseOverMenu = false;
  let closeTimeout: any = null;

  menuDom.addEventListener(
    "mousedown",
    (e) => {
      e.stopPropagation();
    },
    true
  );
  menuDom.addEventListener(
    "click",
    (e) => {
      if (
        e.target &&
        ((e.target as HTMLElement).closest(".MS-OpenSnippet") ||
          (e.target as HTMLElement).closest(".MS-DeleteSnippet") ||
          (e.target as HTMLElement).closest(".MySnippetsButton"))
      )
        return;
      e.stopPropagation();
    },
    true
  );
  menuDom.addEventListener(
    "mouseup",
    (e) => {
      e.stopPropagation();
    },
    true
  );

  // Listen for mouseenter on the menu
  menuDom.addEventListener("mouseenter", () => {
    isMouseOverMenu = true;
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      closeTimeout = null;
    }
  });

  // Listen for mouseleave on the menu, delay closing
  menuDom.addEventListener("mouseleave", () => {
    isMouseOverMenu = false;
    closeTimeout = setTimeout(() => {
      if (!isMouseOverMenu && !isClosing) {
        isClosing = true;
        menu.close();
      }
    }, 200);
  });

  if (settings.aestheticStyle) {
    menuDom.setAttribute(
      "style",
      "background-color: transparent; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);"
    );
  }

  return menu;
}
