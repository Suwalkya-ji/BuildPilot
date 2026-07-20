import {
  Sandpack
} from "@codesandbox/sandpack-react";

const Preview = () => {
  return (
    <Sandpack
      template="react"
      files={{
        "/App.js": {
          code: `
export default function App() {
  return (
    <div style={{padding:40}}>
      <h1>Hello BuildPilot 🚀</h1>
    </div>
  );
}
          `,
        },
      }}
    />
  );
};

export default Preview;