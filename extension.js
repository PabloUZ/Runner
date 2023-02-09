// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vsc-runner" is now active!');
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('vsc-runner.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from vsc-runner!');
	});
	let run = vscode.commands.registerTextEditorCommand('vsc-runner.runcode', function () {
		let file = String(vscode.window.activeTextEditor.document.fileName);
		let ext;
		let nfile = (/^win/.test(process.platform) ? file.split('\\') : file.split('/'));
		let dirTemp = (/^win/.test(process.platform) ? file.split('\\') : file.split('/'));
		dirTemp.pop();
		let dir = dirTemp.join('/');
		let fileId = String(vscode.window.activeTextEditor.document.languageId);
		nfile = nfile[nfile.length - 1].split('.');
		file = nfile[0];
		ext = nfile[1];

		let path;
		if(/^win/.test(process.platform)){
			let pathT = vscode.env.shell.split('\\');
			path = pathT[pathT.length-1];
			pathT = path.split('.');
			path = pathT[0];
		}




		let _terminal;
		if(vscode.window.activeTerminal!=null) {
			vscode.commands.executeCommand('workbench.action.terminal.killAll')
		}
		_terminal = vscode.window.createTerminal(path);
		_terminal.show(false);
		vscode.window.showInformationMessage("Running "+fileId+" on "+path);
		try {
			if(path=="powershell"){
				_terminal.sendText('cd "'+dir+'"');
				_terminal.sendText("clear");
				_terminal.sendText(execMapPS(fileId, file, ext));
			}else if(path=="cmd"){
				_terminal.sendText('cd "'+dir+'"');
				_terminal.sendText("cls");
				_terminal.sendText(execMapCMD(fileId, file, ext));
			}else{
				_terminal.sendText('cd "'+dir+'"');
				_terminal.sendText("clear");
				_terminal.sendText(execMapUnix(fileId, file, ext));
			}
		}catch (e) {
			vscode.window.showInformationMessage("Error executing");
		}
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(run);
}

function execMapUnix(langId, filename, ext){
	switch(langId){
		case 'cpp':
			return 'g++ "'+filename+'.'+ext+'" -o "'+filename+'" '+ '&&' +' "./'+filename+'" '+ ';' +' rm "'+filename+'"';
		case 'python':
			return (/^win/.test(process.platform) ? ('python "'+filename+'.'+ext+'"') : ('python3 "'+filename+'.'+ext+'"'));
		case 'java':
			return 'javac "'+filename+'.'+ext+'" && java "'+filename+'"';
		case 'javascript':
			return 'node "'+filename+'.'+ext+'"';
		case 'typescript':
			return 'node "'+filename+'.'+ext+'"';
		default:
			return "echo 'Error, language is not supported.'";
	}
}
function execMapPS(langId, filename, ext){
	switch(langId){
		case 'cpp':
			return 'g++ "'+filename+'.'+ext+'" -o "'+filename+'.exe" '+ ';' +' ./"'+filename+'.exe" '+ ';' + ' rm "'+filename+'.exe"';
		case 'python':
			return 'python "'+filename+'.'+ext+'"';
		case 'java':
			return 'javac "'+filename+'.'+ext+'" ; java "'+filename+'"';
		case 'javascript':
			return 'node "'+filename+'.'+ext+'"';
		case 'typescript':
				return 'node "'+filename+'.'+ext+'"';
		default:
			return "echo 'Error, language is not supported.'";
	}
}
function execMapCMD(langId, filename, ext){
	switch(langId){
		case 'cpp':
			return 'g++ "'+filename+'.'+ext+'" -o "'+filename+'.exe" '+ '&&' +' .\\"'+filename+'" '+ '&&' +' del "'+filename+'.exe"';
		case 'python':
			return 'python "'+filename+'.'+ext+'"';
		case 'java':
			return 'javac "'+filename+'.'+ext+'" && java "'+filename+'"';
		case 'javascript':
			return 'node "'+filename+'.'+ext+'"';
		case 'typescript':
			return 'node "'+filename+'.'+ext+'"';
		default:
			return "echo 'Error, language is not supported.'";
	}
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
