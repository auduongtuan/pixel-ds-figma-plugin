import * as React from "react";
import * as ui from "./uiHelper";
import { Field, Select } from "./uiComponents";
import { selectMenu } from "figma-plugin-ds";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-php";
import "prismjs/components/prism-go";
import "prismjs/components/prism-ruby";
import "prismjs/components/prism-aspnet";
import "prismjs/components/prism-scss";
const CodeHighlighter = ({ data }) => {
  React.useEffect(() => {
    selectMenu.destroy();
    selectMenu.init();
  }, [data]);
  const updateHandler = () => {
    const code = ui.getInput("code").toString().trim();
    const theme = ui.getInput("theme").toString().trim();
    const language = ui.getInput("language").toString().trim();
    console.log(Prism.languages);
    const tokens = Prism.tokenize(
      code,
      language in Prism.languages ? Prism.languages[language] : "javascript"
    );
    ui.postData({
      type: "codehighlighter_update",
      tokens: tokens,
      language: language,
      theme: theme,
    });
  };
  return (
    <div className="p-16">
      <div className="mt-8">
        <Select
          label="Theme"
          id="theme"
          key={data.theme}
          defaultValue={data.theme}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </Select>
        <Select
          label="Language"
          id="language"
          defaultValue={data.language}
          key={data.language}
          className="mt-16"
        >
          <option value="javascript">JavaScript</option>
          <option value="jsx">JSX</option>
          <option value="html">HTML</option>
          <option value="css">CSS</option>
          <option value="php">PHP</option>
          <option value="go">Go</option>
          <option value="java">Java</option>
          <option value="ruby">Ruby</option>
          <option value="aspnet">C#</option>
        </Select>
        <Field
          label="Code"
          id="code"
          type="textarea"
          className="mt-16"
          defaultValue={data.code}
          rows="16"
        ></Field>
        <button
          className="button button--primary mt-16"
          onClick={updateHandler}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default CodeHighlighter;
