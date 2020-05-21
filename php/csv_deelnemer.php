<?php
	// ----------------------------------------
	// PKU geneeskunde
	// download data as csv file
	// ----------------------------------------

	// server location of this script
	$DOCUMENT_ROOT = $_SERVER['DOCUMENT_ROOT'];
	if (substr ($DOCUMENT_ROOT, -1) == '/') { $DOCUMENT_ROOT = substr ($DOCUMENT_ROOT, 0, -1); }

	// connect to database
	include 'config.php';
	include 'opendb.php';

	// insert into database
	$query = "SELECT
				DNID,
				STUDYNR,
				GESLACHT,
				DOB,
				LASTUPDATE,
				DOMINANT_HAND
			FROM
				Deelnemer";

	$result = mysqli_query($conn, $query) or die('$$ERROR select query failed'); 

	// download csv file
	// https://stackoverflow.com/questions/16251625/how-to-create-and-download-a-csv-file-from-php-script
	
	$delimiter = ";";
	// open raw memory as file so no temp files needed, you might run out of memory though
	$f = fopen('php://memory', 'w'); 

	// loop over the data rows
	$first = true;
	foreach ($result as $row) { 
		// column name header
		if ($first) {
			fputcsv($f, array_keys($row), $delimiter);
			$first = false;
		}
	
		// generate csv lines from the inner arrays
		fputcsv($f, $row, $delimiter); 
	}
	// reset the file pointer to the start of the file
	fseek($f, 0);

	// tell the browser it's going to be a csv file
	header('Content-Type: application/csv');

	// tell the browser we want to save it instead of displaying it
	header('Content-Disposition: attachment; filename="deelnemer.csv";');

	// make php send the generated csv lines to the browser
	fpassthru($f);
	
	include 'closedb.php';
?>