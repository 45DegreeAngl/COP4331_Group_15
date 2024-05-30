<?php
	$inData = getRequestInfo();
	
	$FirstName = $inData["FirstName"];
    $LastName = $inData["LastName"];
    $Phone = $inData["Phone"];
    $Email = $inData["Email"];
	$UserID = $inData["UserID"];

	if ($UserID <= 0) {
		returnWithError("Session timed out. Please log in again.");
		exit();
	}


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Contacts (FirstName,LastName,Phone,Email,UserID) VALUES(?,?,?,?,?)");
		$stmt->bind_param("sssss", $FirstName, $LastName, $Phone, $Email, $UserID);
		$stmt->execute();
		$contactID = $conn->insert_id;
		$stmt->close();
		$conn->close();
		returnWithIdInfo($contactID);
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

	function returnWithIdInfo($contactID) 
	{
		$retValue = '{"ID":' . $contactID . ',"error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
