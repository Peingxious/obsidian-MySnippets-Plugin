import { Menu, ToggleComponent, ButtonComponent, Notice } from "obsidian";
import { EnhancedApp, EnhancedMenu } from "src/settings/type";

export function createSnippetItem(
  menu: EnhancedMenu,
  app: EnhancedApp,
  snippet: string,
  customCss: any,
) {
  const snippetsFolder = customCss.getSnippetsFolder();
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
}
