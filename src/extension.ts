// This method is called when your extension is deactivated
export function deactivate() { }

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('pytest-grabber.generatePath', () => {
		const editor = vscode.window.activeTextEditor;

		if (editor) {

			const document = editor.document;
			const selection = editor.selection;

			const line = document.lineAt(selection.active.line);
			let classNameMatch: RegExpMatchArray | null = null;
			let methodNameMatch: RegExpMatchArray | null = null;

			// Search for the class and method names above the current line
			for (let i = selection.active.line; i >= 0; i--) {
				const line = document.lineAt(i);

				if (!methodNameMatch) {
					methodNameMatch = line.text.match(/def\s+(\w+)\(/);
				}

				if (!classNameMatch) {
					classNameMatch = line.text.match(/class\s+(\w+)\(/);
				}

				if (classNameMatch) {
					break;
				}
			}

			if (classNameMatch && methodNameMatch) {
				const className = classNameMatch[1];
				const methodName = methodNameMatch[1];
				const filePath = vscode.workspace.asRelativePath(document.uri, false);

				vscode.env.clipboard.writeText(`${filePath}::${className}::${methodName}`);
				vscode.window.showInformationMessage('Path copied to clipboard');
			} else if (classNameMatch) {
				const className = classNameMatch[1];
				const filePath = vscode.workspace.asRelativePath(document.uri, false);

				vscode.env.clipboard.writeText(`${filePath}::${className}`);
				vscode.window.showInformationMessage('Path copied to clipboard');
			} else {
				vscode.window.showInformationMessage('No match found!');
			}
		}
	});

	context.subscriptions.push(disposable);
}
