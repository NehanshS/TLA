import sys
from specklepy.api.client import SpeckleClient
from specklepy.objects import Base
from specklepy.transports.server import ServerTransport

# CLI usage: python your_speckle_push.py path/to/export_3D.ifc
export_file = sys.argv[1]
SPECKLE_SERVER_URL = "https://app.speckle.systems"
SPECKLE_STREAM_ID = "<YOUR_STREAM_ID>"
SPECKLE_TOKEN = "<YOUR_TOKEN>"

# Setup client
client = SpeckleClient(host=SPECKLE_SERVER_URL, use_ssl=True)
client.authenticate_with_token(SPECKLE_TOKEN)
transport = ServerTransport(client=client, stream_id=SPECKLE_STREAM_ID)

# Prepare file as Base object (minimal for demo; you can enhance to parse and add properties)
speckle_obj = Base()
speckle_obj["ifc_file"] = open(export_file, "rb").read()  # For small test, otherwise upload to cloud storage and link

commit_id = client.commit.create(
    stream_id=SPECKLE_STREAM_ID,
    object=speckle_obj,
    branch_name="main",
    message="Automated IFC upload from pyRevit"
)
print("Speckle commit ID:", commit_id)
