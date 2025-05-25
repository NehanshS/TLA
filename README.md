# TLA
WEB APP
Open the pyRevit CLI (find it in Start Menu as “pyRevit CLI”).

To create your extension locally (say at C:\Users\<your_user>\pyRevitExtensions), run:

bash
Copy
Edit
pyrevit extend library "C:\Users\<your_user>\pyRevitExtensions"
To set this as your dev extension root (so edits appear instantly):

bash
Copy
Edit
pyrevit configs extensions searchpaths add "C:\Users\<your_user>\pyRevitExtensions"
Restart Revit to ensure pyRevit picks up dev extensions.

IronPython Traceback:
Traceback (most recent call last):
 File "C:\Program Files\pyRevit-Master\extensions\pyRevitBundlesCreatorExtension.extension\pyRevit Bundles Creator.tab\Button creation.panel\Button Creator.pushbutton\script.py", line 24, in <module>
WindowsError: [Errno 13] [Errno 5] Access to the path 'C:\Program Files\pyRevit-Master\extensions\pyRevitBundlesCreatorExtension.extension\pyRevit Bundles Creator.tab\My New Panel Name.panel' is denied.

Script Executor Traceback:
System.ComponentModel.Win32Exception (0x80004005): WindowsError
 at IronPython.Modules.PythonNT.mkdir(String path)
 at Microsoft.Scripting.Interpreter.ActionCallInstruction`1.Run(InterpretedFrame frame)
 at Microsoft.Scripting.Interpreter.Interpreter.Run(InterpretedFrame frame)
 at Microsoft.Scripting.Interpreter.LightLambda.Run4[T0,T1,T2,T3,TRet](T0 arg0, T1 arg1, T2 arg2, T3 arg3)
 at System.Dynamic.UpdateDelegates.UpdateAndExecute3[T0,T1,T2,TRet](CallSite site, T0 arg0, T1 arg1, T2 arg2)
 at Microsoft.Scripting.Interpreter.DynamicInstruction`4.Run(InterpretedFrame frame)
 at Microsoft.Scripting.Interpreter.Interpreter.Run(InterpretedFrame frame)
 at Microsoft.Scripting.Interpreter.LightLambda.Run2[T0,T1,TRet](T0 arg0, T1 arg1)
 at IronPython.Compiler.PythonScriptCode.RunWorker(CodeContext ctx)
 at PyRevitLabs.PyRevit.Runtime.IronPythonEngine.Execute(ScriptRuntime& runtime)

 D:\New folder\OneDrive - Cal Poly\Documents\GitHub\TLA\TLA.extension\Tool.tab\AutoSync.group\PushToSpeckle.pushbutton

 python --version
python -c "import platform; print(platform.python_implementation())"
