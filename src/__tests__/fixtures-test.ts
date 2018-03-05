// tslint:disable:object-literal-sort-keys
import * as fs from "fs";
import * as path from "path";
import * as ts from "typescript";

const tsConfig = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "..", "..", "tsconfig.json"), "utf-8"),
);
const globalConfig = ts.convertCompilerOptionsFromJson(
  tsConfig.compilerOptions,
  path.resolve(__dirname, "..", ".."),
);
const localConfig: ts.CompilerOptions = {
  noUnusedLocals: false,
  noEmit: true,
  include: [path.resolve(__dirname, "../../src")],
};
const compilerOptions: ts.CompilerOptions = Object.assign({}, globalConfig.options, localConfig);

const fixturesDir = path.resolve(__dirname, "fixtures");
const fixtureNames = fs.readdirSync(fixturesDir);
const fixtureFileNames = fixtureNames.map(name => path.resolve(fixturesDir, name));
const fixtureFiles = fixtureFileNames.map(fileName => fs.readFileSync(fileName, "utf8"));
const program = ts.createProgram(fixtureFileNames, compilerOptions);
const emitResult = program.emit();
const allDiagnostics = [...ts.getPreEmitDiagnostics(program), ...emitResult.diagnostics];

fixtureNames.forEach((name, i) => {
  test(name, () => {
    const diagnostics = allDiagnostics
      .filter(({ file }) => file.fileName === fixtureFileNames[i])
      .map(({ file, ...diagnostic }) => ({
        ...diagnostic,
        text: file.text.slice(diagnostic.start, diagnostic.start + diagnostic.length),
      }));
    expect(diagnostics).toMatchSnapshot();
  });
});
