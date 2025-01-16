// This method is called when your extension is deactivated
export function deactivate() { }

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('pytest-grabber.generatePath', () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) return;  // Early return if no editor is active

		const config = vscode.workspace.getConfiguration('pytest-grabber');
		const document = editor.document;
		const selection = editor.selection;

		let classNameMatch: RegExpMatchArray | null = null;
		let methodNameMatch: RegExpMatchArray | null = null;

		// Search for the class and method names above the current line
		for (let i = selection.active.line; i >= 0; i--) {
			const line = document.lineAt(i);

			if (!methodNameMatch) methodNameMatch = line.text.match(/def\s+(\w+)\(/);


			if (!classNameMatch) classNameMatch = line.text.match(/class\s+(\w+)([\(:])/);

			if (classNameMatch) break;
		}

		// Gather all path components.
		const separator = config.get<string>('separator') || '${separator}';
		// Get prefixCmd and add a space if it doesn't have it.
		let prefixCmd = config.get<string>('prefixCmd') || '';
		if (prefixCmd && !prefixCmd.endsWith(" ")) {
			prefixCmd += " ";
		}
		const filePath = vscode.workspace.asRelativePath(document.uri, false);
		const className = classNameMatch?.[1];
		const methodName = methodNameMatch?.[1];

		if (!className && !methodName) {
			vscode.window.showInformationMessage('No match found!');
		} else {
			// We have at least one part.
			// Gather all path components in an array for simplicity
			const pathComponents: string[] = [];

			pathComponents.push(filePath);

			if (className && methodName) {
				pathComponents.push(className, methodName);
			} else if (className) {
				pathComponents.push(className);
			} else if (methodName) {
				pathComponents.push(methodName);
			}

			let clipboard = "";
			if (prefixCmd) clipboard += prefixCmd;

			clipboard += pathComponents.join(separator);

			vscode.env.clipboard.writeText(clipboard);
			vscode.window.showInformationMessage('Path copied to clipboard');
		}
	});

	context.subscriptions.push(disposable);
}
