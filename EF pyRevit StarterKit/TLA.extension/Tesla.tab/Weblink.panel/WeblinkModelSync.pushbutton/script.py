from pyrevit import script, forms
from Autodesk.Revit.DB import *
from Autodesk.Revit.UI import *
import clr, sys, os

# Add path to specklepy if needed (optional, only if Revit Python can't find it)
# sys.path.append(r"C:\path\to\specklepy")

try:
    from specklepy.api.client import SpeckleClient
    from specklepy.api.credentials import get_local_account
    from specklepy.objects import Base
    from specklepy.transports.server import ServerTransport
except ImportError:
    forms.alert("Specklepy not installed! Please run 'pip install specklepy' in your Python environment.")
    raise

# ==== USER EDITS: Set these ====
SPECKLE_SERVER_URL = "https://app.speckle.systems"
SPECKLE_STREAM_ID = "35ec9c1d80"
SPECKLE_TOKEN = "2870a8f9381058cfe8d6519065d7245398883c941f"  # Best to keep this in env vars or a config, not in the script

# ==== Main Function ====
output = script.get_output()
output.print_md("## Sync Cloud: Push Model to Speckle")

doc = __revit__.ActiveUIDocument.Document

# Collect all model elements (can filter as needed)
collector = FilteredElementCollector(doc).WhereElementIsNotElementType().ToElements()

# Simple conversion: collect element ids (for demo; in practice use converter or serialize geometry/params)
elements_data = []
for elem in collector:
    try:
        # For demonstration, we'll just get element id and name
        elem_data = {
            "id": str(elem.Id),
            "category": elem.Category.Name if elem.Category else "None",
            "name": elem.Name
        }
        elements_data.append(elem_data)
    except Exception as ex:
        pass

# Build a Speckle Base object
speckle_obj = Base()
speckle_obj["elements"] = elements_data
speckle_obj["revit_model"] = doc.Title

# Set up the Speckle client and transport
client = SpeckleClient(host=SPECKLE_SERVER_URL, use_ssl=True)
client.authenticate_with_token(SPECKLE_TOKEN)
transport = ServerTransport(client=client, stream_id=SPECKLE_STREAM_ID)

# Send to Speckle (this creates a new commit)
commit_id = client.commit.create(
    stream_id=SPECKLE_STREAM_ID,
    object=speckle_obj,
    branch_name="main",
    message="Automated push from pyRevit"
)

output.print_md(f"### Model pushed to Speckle! **Commit ID:** `{commit_id}`")
forms.alert("Model data pushed to Speckle successfully!", exitscript=True)
