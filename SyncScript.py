from pyrevit import script, forms
from Autodesk.Revit.DB import FilteredElementCollector, BuiltInCategory, Element
import os
import sys

# --- SPECKLEPY IMPORTS ---
try:
    from specklepy.api.client import SpeckleClient
    from specklepy.api.credentials import get_local_account
    from specklepy.objects import Base
except ImportError:
    forms.alert("specklepy is not installed. Please run 'pip install specklepy' in your Python environment.", exitscript=True)

# --- SPECKLE CREDENTIALS ---
SPECKLE_SERVER_URL = "https://speckle.xyz"  # or your org's server
SPECKLE_TOKEN = "YOUR_SPECKLE_TOKEN"
SPECKLE_STREAM_ID = "YOUR_STREAM_ID"

# --- SETUP CLIENT ---
client = SpeckleClient(host=SPECKLE_SERVER_URL)
client.authenticate(token=SPECKLE_TOKEN)

# --- GRAB CURRENT REVIT DOC ---
doc = __revit__.ActiveUIDocument.Document

# --- EXTRACT MODEL ELEMENTS (Example: All Generic Models) ---
collector = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_GenericModel).WhereElementIsNotElementType()
elements = collector.ToElements()

# --- CONVERT ELEMENTS TO SPECKLE BASE OBJECTS ---
# This is a simple stub - replace with full element property extraction as needed
speckle_objs = []
for el in elements:
    base = Base()
    base.id = el.Id.IntegerValue
    base.name = el.Name if hasattr(el, "Name") else "Unnamed"
    # You can add more properties here...
    speckle_objs.append(base)

# --- CREATE BRANCH OBJECT ---
branch = Base()
branch["elements"] = speckle_objs

# --- CREATE A NEW COMMIT ---
commit_id = client.commit.create(
    stream_id=SPECKLE_STREAM_ID,
    object=branch,
    message="Pushed from pyRevit Weblink Sync Cloud",
    branch_name="main"
)

forms.alert("Sync to Speckle complete!\nCommit ID: {}".format(commit_id), exitscript=True)
