; Run Notepad
Run("../../Launcher.exe", "../../")

; Wait 10 seconds for the Notepad window to appear.
Local $hWndLnchr = WinWait("CoopAndreas Launcher", "", 10)

ControlClick($hWndLnchr, "", "[NAME:b_connect]")


Local $hWnd = WinWait("[CLASS:Grand theft auto San Andreas]", "", 10)

WinClose($hWndLnchr, "")

Local $hSAWindow = GetMostRecentWindow("GTA: San Andreas")
If $hSAWindow <> 0 Then
    WinActivate($hSAWindow) ; Activate the window
Else
    MsgBox(0, "Error", "No matching window found.")
EndIf

Sleep(100)
MouseClick("left", 900, 450)
MouseClick("left", 550, 350)

Sleep(4000)

; Retrieve the position as well as the height and width of the Notepad window. We will use this when we have to move the window back to the original position.
Local $aPos = WinGetPos($hSAWindow)

Local $SACount = GetWindowsCount("CoopAndreas")
Local $newWindowPos = GetNewWindowPosition($SACount)
;Local $xpos =  $SACount * 400
; MsgBox(0, "Error", $xpos)
; Move the Notepad to the x, y position of 0, 0 and set the height and width at 200, 200.

WinMove($hSAWindow, "", $newWindowPos[0], $newWindowPos[1], 400, 400)

; Close the Notepad window using the handle returned by WinWait.
;WinClose($hWnd)

Func GetMostRecentWindow($sTitle)
    Local $aWindows = WinList() ; Get the list of all open windows
    Local $aRecentWindow = ""

    For $i = 1 To $aWindows[0][0] ; Loop through the window list
        $windowTitle = $aWindows[$i][0] ; Get the window title
        If StringInStr($windowTitle, $sTitle) > 0 Then ; Check if the title matches
            $aRecentWindow = $aWindows[$i][1] ; Store the window handle
        EndIf
    Next

    If $aRecentWindow = "" Then
        Return 0 ; Return 0 if no matching window is found
    Else
        Return $aRecentWindow ; Return the handle of the most recent window with the title
    EndIf
EndFunc

Func GetWindowsCount($sTitle)
    Local $aWindows = WinList() ; Get the list of all open windows
    Local $count = 0

    For $i = 1 To $aWindows[0][0] ; Loop through the window list
        $windowTitle = $aWindows[$i][0] ; Get the window title
        If StringInStr($windowTitle, $sTitle) > 0 Then ; Check if the title matches
            $count = $count +1
        EndIf
    Next

	Return $count ; Return the handle of the most recent window with the title
EndFunc

Func GetNewWindowPosition($existingWindowsCount)
	Local $result[2]
    ; Get screen dimensions
    Local $iScreenWidth = @DesktopWidth
    Local $iScreenHeight = @DesktopHeight

    ; Define window size (assume a standard window size)
    Local $iWindowWidth = 400
    Local $iWindowHeight = 400

    ; Calculate number of columns that can fit on the screen
    Local $iColumns = Floor($iScreenWidth / $iWindowWidth)
    Local $iRows = Floor($iScreenHeight / $iWindowHeight)

    ; Determine the position of the new window based on existing windows count
    Local $iCol = Mod($existingWindowsCount, $iColumns)  ; Column index
    Local $iRow = Floor($existingWindowsCount / $iColumns)  ; Row index

    ; Calculate X and Y coordinates
    Local $newX = $iCol * $iWindowWidth
    Local $newY = $iRow * $iWindowHeight
    
    ; Ensure the new coordinates do not exceed the screen bounds
    If $newX + $iWindowWidth > $iScreenWidth Then
        $newX = $iScreenWidth - $iWindowWidth
    EndIf

    If $newY + $iWindowHeight > $iScreenHeight Then
        $newY = $iScreenHeight - $iWindowHeight
    EndIf

	$result[0] = $newX
	$result[1] = $newY
    Return $result
EndFunc