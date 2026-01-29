import { Menu, ButtonComponent, Notice } from "obsidian";
import { setAttributes } from "src/util/setAttributes";
import { EnhancedApp, EnhancedMenuItem } from "src/settings/type";
import CreateSnippetModal from "src/modal/createSnippetModal";
import MySnippetsPlugin from "src/plugin/main";

export function createMenuActions(
  menu: Menu,
  app: EnhancedApp,
  plugin: MySnippetsPlugin,
  snippetsFolder: string,
  customCss: any
) {
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
}
