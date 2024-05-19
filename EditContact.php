<?php
	$inData = getRequestInfo();
	
	$FirstNameOld = $inData["FirstNameOld"];
    $LastNameOld = $inData["LastNameOld"];
    $PhoneOld = $inData["PhoneOld"];
    $EmailOld = $inData["EmailOld"];
	$UserID = $inData["UserID"];
    $FirstNameNew = $inData["FirstNameNew"];
    $LastNameNew = $inData["LastNameNew"];
    $PhoneNew = $inData["PhoneNew"];
    $EmailNew = $inData["EmailNew"];
	


	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET FirstName =? , LastName =?, Phone = ?, Email =?  WHERE (FirstName =? AND LastName =? AND Phone = ? AND Email =? AND UserID =?)");
		$stmt->bind_param("sssssssss", $FirstNameNew, $LastNameNew, $PhoneNew, $EmailNew, $FirstNameOld, $LastNameOld, $PhoneOld, $EmailOld, $UserID);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
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
	
?>