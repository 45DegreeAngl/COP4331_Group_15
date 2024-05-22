<?php
	$inData = getRequestInfo();

    $Login = $inData["Login"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("SELECT * FROM Users WHERE Login =? LIMIT 1");
		$stmt->bind_param("s", $Login);
		$stmt->execute();
        $result = $stmt->get_result();
        if( $row = $result->fetch_assoc()  )
		{
			returnWithError("Login Already In Use");
		}
		else
		{
            $stmt->close();
		    $conn->close();
            returnWithError("");
		}
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
