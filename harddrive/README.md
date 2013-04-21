The harddisk in the Horizon mediabox seems only to have recorded episodes on it. The sda1 partition stores the thumbnails for the episodes, from the sda2 partition I put some files here, and the sda3 drive has the actual recordings.

    $> sudo fdisk -l

    Disk /dev/sda: 500.1 GB, 500107862016 bytes
    255 heads, 63 sectors/track, 60801 cylinders, total 976773168 sectors
    Units = sectors of 1 * 512 = 512 bytes
    Sector size (logical/physical): 512 bytes / 512 bytes
    I/O size (minimum/optimal): 512 bytes / 512 bytes
    Disk identifier: 0x00000000

       Device Boot      Start         End      Blocks   Id  System
    /dev/sda1              63     1012094      506016   83  Linux
    /dev/sda2         1012095     9028529     4008217+  83  Linux
    /dev/sda3         9028530   976768064   483869767+   1  FAT12

The sda3 partition is organized like this.

    $> rsync -avzul /mnt/* ~/samsung/sda3
    sending incremental file list
    ROOT_DIR.CP0
    OPENEDFI.LES/
    S100/
    S100/00000001.XMA
    S100/00000001.XMI
    S100/00000001.XMV
    S100/META_MAN.MTA
    S100/META_MAN.MTI
    S100/META_MAN.XMD
    S100/STREAM.EXN
    S100/STREAM.STR

And so on with a directory for every recording. Nothing really interesting here.

    $> strings sda2/dbsi| head -n 20

    SQLite format 3
    }tablesi_SysStrsi_SysStr
    CREATE TABLE si_SysStr (strId INTEGER NOT NULL,mlId INTEGER,lngId INTEGER NOT NULL,encId INTEGER NOT NULL,compressed INTEGER,data BLOB NOT NULL,CONSTRAINT PkSysStr PRIMARY KEY (strId))
    tablesi_NvodRefSvcsi_NvodRefSvc
    CREATE TABLE si_NvodRefSvc (nvodSvcId INTEGER NOT NULL,buqKey1 INTEGER NOT NULL,tsId INTEGER NOT NULL,svcKey1 INTEGER NOT NULL,svcKey2 INTEGER NOT NULL,type INTEGER NOT NULL,flags INTEGER NOT NULL,svcNum INTEGER NOT NULL,cndState INTEGER NOT NULL,schedDepth INTEGER NOT NULL,CONSTRAINT PkNvodRefSvc PRIMARY KEY (nvodSvcId))
    stablesi_Genresi_Genre
    CREATE TABLE si_Genre (genreId INTEGER NOT NULL,category INTEGER NOT NULL,CONSTRAINT PkGenre PR
    WDR 4
    UPC NL
    WDR 3
    UPC NL
    WDR 2
    UPC NL
    WDR 1
    UPC NL
    SLAM!TV
    UPC NL
    BravaNL
    UPC NL
    FOXlife HD
