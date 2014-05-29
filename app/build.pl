#! perl -p -i

BEGIN { 
	(undef, $mm, $hr, $dd, $MM, $YYYY) = localtime(time); 
	$MM++ ; 
	$YYYY+=1900; 
	$build_id = sprintf("%04d%02d%02d%02d%02d", $YYYY, $MM, $dd, $hr, $mm);
	print STDERR "The build id is $build_id\n";
} 

if (m/mk-build/) { 
	
#	if(m/(['"].*)\.((js|css|json)['"])/) {
#		print STDERR "I saw $1$build_id.$2\n";
#	}
	if (s/(['"].*)\.((js|css|json)['"])/$1_$build_id.$2/) {
		system("/bin/mv '$1.$2' '$1_$build_id.$2'")
			and warn "Look out, mv '$1.$2' '$1_$build_id.$2' failed\n";
	}  
}
