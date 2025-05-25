from pyrevit import forms, script
from Autodesk.Revit.DB import *
import clr, os, datetime

# === Step 1: Export default 3D view as IFC ===
doc = __revit__.ActiveUIDocument.Document
view_3d = None

collector = FilteredElementCollector(doc).OfClass(View3D)
for v in collector:
    if not v.IsTemplate and v.Name == "{3D}":
        view_3d = v
        break

if not view_3d:
    forms.alert("Default 3D view '{3D}' not found!")
    script.exit()

# Choose a temp export path
export_dir = os.path.expanduser("~\\Documents\\IFC_Exports")
if not os.path.exists(export_dir):
    os.makedirs(export_dir)
timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
export_path = os.path.join(export_dir, "model_{}.ifc".format(timestamp))

# Set up IFC export options
ifc_options = IFCExportOptions()
# (You can tweak options if you want—let me know if you want detailed config)

# Export!
result = doc.Export(export_dir, os.path.basename(export_path), view_3d.Id, ifc_options)

if not result:
    forms.alert("IFC Export failed!")
    script.exit()

# === Step 2: Trigger external Python script ===
python_exe = r"C:\Path\To\python.exe"  # <-- CHANGE THIS TO YOUR PYTHON 3 PATH
external_script = r"C:\Path\To\push_ifc_to_speckle.py"  # <-- CHANGE THIS TO YOUR SCRIPT
cmd = '"{}" "{}" "{}"'.format(python_exe, external_script, export_path)
os.system(cmd)

forms.alert("IFC exported and external push started!", exitscript=True)
