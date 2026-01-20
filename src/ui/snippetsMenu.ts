import type MySnippetsPlugin from "src/plugin/main";
import { Menu, ToggleComponent, ButtonComponent, Notice } from "obsidian";
import { setAttributes } from "src/util/setAttributes";
import { MySnippetsSettings } from "src/settings/settingsData";
import CreateSnippetModal from "src/modal/createSnippetModal";
import { EnhancedApp, EnhancedMenu, EnhancedMenuItem } from "src/settings/type";

export default function snippetsMenu(
  app: EnhancedApp,
  plugin: MySnippetsPlugin,
  settings: MySnippetsSettings,
) {
  const windowX = window.innerWidth;
  const windowY = window.innerHeight;
  const menuExists = document.querySelector(".menu.MySnippets-statusbar-menu");

  if (!menuExists) {
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
      true,
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
      true,
    );
    menuDom.addEventListener(
      "mouseup",
      (e) => {
        e.stopPropagation();
      },
      true,
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
        "background-color: transparent; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);",
      );
    }
    const customCss = app.customCss;
    const currentSnippets = customCss.snippets;
    const snippetsFolder = customCss.getSnippetsFolder();

    currentSnippets.forEach((snippet: string) => {
      const snippetPath = customCss.getSnippetPath(snippet);

      menu.addItem((snippetElement) => {
        snippetElement.setTitle(snippet);

        const snippetElementDom = (snippetElement as any).dom as HTMLElement;
        const toggleComponent = new ToggleComponent(snippetElementDom);
        const buttonComponent = new ButtonComponent(snippetElementDom);
        const deleteButton = new ButtonComponent(snippetElementDom);

        function changeSnippetStatus() {
          const isEnabled = customCss.enabledSnippets.has(snippet);
          customCss.setCssEnabledStatus(snippet, !isEnabled);
        }

        toggleComponent
          .setValue(customCss.enabledSnippets.has(snippet))
          .onChange(changeSnippetStatus);

        buttonComponent
          .setIcon("ms-snippet")
          .setClass("MS-OpenSnippet")
          .setTooltip(`Open snippet`)
          .onClick((e: any) => {
            app.openWithDefaultApp(snippetPath);
            e.stopPropagation();
          });

        deleteButton
          .setIcon("ms-delete")
          .setClass("MS-DeleteSnippet")
          .setTooltip("Delete snippet")
          .onClick(async (e: any) => {
            const filepath = `${customCss.getSnippetsFolder()}/${snippet}.css`;
            try {
              if (await app.vault.adapter.exists(filepath)) {
                await app.vault.adapter.remove(filepath);
                new Notice(`"${snippet}" deleted.`);
                customCss.requestLoadSnippets();
                menu.close();
              }
            } catch (error) {
              new Notice("Error deleting snippet: " + error);
              console.error(error);
            }
            e.stopPropagation();
          });

        snippetElementDom.addEventListener("click", (e: any) => {
          const target = e.target as HTMLElement;
          const isToggle = toggleComponent.toggleEl.contains(target);
          const isButton = buttonComponent.buttonEl.contains(target);
          const isDelete = deleteButton.buttonEl.contains(target);
          if (!isToggle && !isButton && !isDelete) {
            changeSnippetStatus();
          }
          e.stopPropagation();
        });
      });
    });

    menu.addSeparator();

    menu.addItem((actions: EnhancedMenuItem) => {
      actions.setIcon(null);
      actions.setTitle("Actions");
      const actionsDom = (actions as any).dom as HTMLElement;
      setAttributes(actions.titleEl, { style: "font-weight: 700" });

      const reloadButton = new ButtonComponent(actionsDom);
      const folderButton = new ButtonComponent(actionsDom);
      const addButton = new ButtonComponent(actionsDom);

      setAttributes(reloadButton.buttonEl, { style: "margin-right: 3px" });
      setAttributes(addButton.buttonEl, { style: "margin-left: 3px" });

      reloadButton
        .setIcon("ms-reload")
        .setTooltip("Reload snippets")
        .onClick((e: any) => {
          customCss.requestLoadSnippets();
          new Notice("Snippets reloaded");
          e.stopPropagation();
        });
      reloadButton.buttonEl.addClass("MySnippetsButton");
      reloadButton.buttonEl.addClass("MS-Reload");

      folderButton
        .setIcon("ms-folder")
        .setTooltip("Open snippets folder")
        .onClick(async (e: any) => {
          if (!(await app.vault.adapter.exists(snippetsFolder))) {
            await app.vault.adapter.mkdir(snippetsFolder);
          }
          app.openWithDefaultApp(snippetsFolder);
          e.stopPropagation();
        });
      folderButton.buttonEl.addClass("MySnippetsButton");
      folderButton.buttonEl.addClass("MS-Folder");

      addButton
        .setIcon("ms-add")
        .setTooltip("Create new snippet")
        .onClick((e: any) => {
          new CreateSnippetModal(app, plugin).open();
          e.stopPropagation();
        });
      addButton.buttonEl.addClass("MySnippetsButton");
      addButton.buttonEl.addClass("MS-Add");
    });

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
