# PushToSpeckle.pushbutton/script.py
# This script will notify the user and (optionally) call a command to push the current model to Speckle.
# You can expand the logic to call a Speckle CLI, API, or your own automation scripts.

from pyrevit import script
import os

output = script.get_output()
output.print_md("## 🚀 Push to Speckle Stream")

# (Replace these with your actual logic or commands)
def push_to_speckle():
    # Example: Notify user
    output.print_md("Pushing the active Revit model to Speckle...")
    # Example: If you have a CLI/PowerShell/Batch file, call it here.
    # Uncomment and modify as needed:
    # os.system('speckle.exe send --stream your_stream_id --file "%s"' % __revit__.ActiveUIDocument.Document.PathName)
    # output.print_md("Push complete!")
    output.print_md("**[Placeholder]** Implement your Speckle push logic here.")

if __name__ == "__main__":
    push_to_speckle()