# TLA
WEB APP
Error Message: invalid syntax 
Line/Column: 27/12 
Line Text: os.system(f'"{python_exe}" "{SPECKLE_PUSH_SCRIPT}" "{export_path}"') 

IronPython Traceback:
Traceback (most recent call last):
 File "D:\New folder\OneDrive - Cal Poly\Documents\GitHub\TLA\EF pyRevit StarterKit\TLA.extension\Tesla.tab\Weblink.panel\WeblinkModelSync.pushbutton\script.py", line 23, in <module>
Exception: Modifying is forbidden because the document has no open transaction.

Script Executor Traceback:
Autodesk.Revit.Exceptions.ModificationOutsideTransactionException: Modifying is forbidden because the document has no open transaction.
 at Autodesk.Revit.DB.Document.Export(String folder, String name, IFCExportOptions options)
 at Microsoft.Scripting.Interpreter.FuncCallInstruction`5.Run(InterpretedFrame frame)
 at Microsoft.Scripting.Interpreter.Interpreter.Run(InterpretedFrame frame)
 at Microsoft.Scripting.Interpreter.LightLambda.Run6[T0,T1,T2,T3,T4,T5,TRet](T0 arg0, T1 arg1, T2 arg2, T3 arg3, T4 arg4, T5 arg5)
 at System.Dynamic.UpdateDelegates.UpdateAndExecute5[T0,T1,T2,T3,T4,TRet](CallSite site, T0 arg0, T1 arg1, T2 arg2, T3 arg3, T4 arg4)
 at Microsoft.Scripting.Interpreter.DynamicInstruction`6.Run(InterpretedFrame frame)
 at Microsoft.Scripting.Interpreter.Interpreter.Run(InterpretedFrame frame)
 at Microsoft.Scripting.Interpreter.LightLambda.Run2[T0,T1,TRet](T0 arg0, T1 arg1)
 at IronPython.Compiler.PythonScriptCode.RunWorker(CodeContext ctx)
 at PyRevitLabs.PyRevit.Runtime.IronPythonEngine.Execute(ScriptRuntime& runtime)