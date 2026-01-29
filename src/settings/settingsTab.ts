import type MySnippetsPlugin from "src/plugin/main";
import { App, Setting, PluginSettingTab, TextAreaComponent } from "obsidian";
import { setAttributes } from "src/util/setAttributes";
import { buyMeACoffeeButton, paypalButton, kofiButton } from "src/ui/components/DonationButtons";

export class MySnippetsSettingTab extends PluginSettingTab {
  plugin: MySnippetsPlugin;
  appendMethod: string;

  constructor(app: App, plugin: MySnippetsPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "Plugin Settings" });
    new Setting(containerEl)
      .setName("Glass menu effect")
      .setDesc(
        "Choose to change the background from the secondary background color of your theme to a glass background.",
      )
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.aestheticStyle)
          .onChange(async (value) => {
            this.plugin.settings.aestheticStyle = value;
            this.plugin.saveSettings();
          });
      });

    new Setting(containerEl)
      .setName("Auto open new snippet")
      .setDesc(
        "Choose whether or not to open CSS snippet files immeditaley after creating them. It will open in your default app.",
      )
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.openSnippetFile)
          .onChange(async (value) => {
            this.plugin.settings.openSnippetFile = value;
            this.plugin.saveSettings();
          });
      });
    new Setting(containerEl)
      .setName("Set new snippet status")
      .setDesc(
        "Choose whether or not to have newly created CSS snippet files toggled on automatically upon creation.",
      )
      .addToggle((toggle) => {
        toggle
          .setValue(this.plugin.settings.snippetEnabledStatus)
          .onChange(async (value) => {
            this.plugin.settings.snippetEnabledStatus = value;
            this.plugin.saveSettings();
          });
      });

    const stylingTemplateSetting = new Setting(containerEl);
    stylingTemplateSetting.settingEl.setAttribute(
      "style",
      "display: grid; grid-template-columns: 1fr;",
    );
    stylingTemplateSetting
      .setName("CSS snippet template")
      .setDesc(
        "Set default CSS styling as a template for new CSS files you choose to create.",
      );

    const stylingTemplateContent = new TextAreaComponent(
      stylingTemplateSetting.controlEl,
    );
    setAttributes(stylingTemplateContent.inputEl, {
      style: "margin-top: 12px; width: 100%;  height: 32vh;",
      class: "ms-css-editor",
    });
    stylingTemplateContent

      .setValue(this.plugin.settings.stylingTemplate)
      .onChange(async (value) => {
        this.plugin.settings.stylingTemplate = value;
        this.plugin.saveSettings();
      });

    const msDonationDiv = containerEl.createEl("div", {
      cls: "msDonationSection",
    });

    const donateText = createEl("p");
    donateText.appendText(
      "If you like this Plugin and are considering donating to support continued development, use the buttons below!",
    );
    msDonationDiv.appendChild(donateText);

    msDonationDiv.appendChild(
      buyMeACoffeeButton("https://www.buymeacoffee.com/chetachi")
    );
    msDonationDiv.appendChild(
      paypalButton("https://www.paypal.com/paypalme/chetachiezikeuzor")
    );
    msDonationDiv.appendChild(
      kofiButton("https://ko-fi.com/chetachi")
    );
  }
}
