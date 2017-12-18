
<?xml version="1.0"?>
<xmlRoot><Status Operate="Get">
<Phase>
</Phase>
</Status>
</xmlRoot>



<?xml version="1.0"?>
<xmlRoot><Status Operate="Get">
<Channel>
</Channel>
</Status>
</xmlRoot>







海康信号机UDP协议转换 
心跳包
0000   6e 6e 00 00 b4 3e 00 00 01 00 00 00


读取通道的状态
            
0000   6e 6e 00 00 59 01 00 00
返回结果
|++++++前缀++++++|+++++|
0000   6e 6e 00 00 59 01 00 00 01 93 00 28 02 93 00 28
0010   03 00 00 00 04 00 00 00
|++++++前缀++++++|+++++|
0000   6e 6e 00 00 59 01 00 00 01 1a 00 01 02 8a 00 04
0010   03 00 00 00 04 00 00 00


<?xml version="1.0"?>
<xmlRoot><Status><Channel><Red>36363</Red><Yellow>16</Yellow><Green>0</Green></Channel></Status></xmlRoot>
0000   6e 6e 00 00 59 01 00 00 01 0b 10 00 02 8e 00 00
0010   03 00 00 00 04 00 00 00

<?xml version="1.0"?>
<xmlRoot><Status><Channel><Red>35865</Red><Yellow>514</Yellow><Green>0</Green></Channel></Status></xmlRoot>
0000   6e 6e 00 00 59 01 00 00 01 19 02 00 02 8c 02 00
0010   03 00 00 00 04 00 00 00

<?xml version="1.0"?>
<xmlRoot><Status><Channel><Red>36363</Red><Yellow>16</Yellow><Green>0</Green></Channel></Status></xmlRoot>
0000   6e 6e 00 00 59 01 00 00 01 0b 10 00 02 8e 00 00
0010   03 00 00 00 04 00 00 00


<?xml version="1.0"?>
<xmlRoot><Status><Channel><Red>0x8603</Red><Yellow>0</Yellow><Green>2072</Green></Channel></Status></xmlRoot>
|++++++前缀++++++|+++++|++++++红0++|+绿0+|+红1+|+绿1+|
0000   6e 6e 00 00 59 01 00 00 01 03 00 18 02 86 00 08
|++++++
0010   03 00 00 00 04 00 00 00


全红控制
<?xml version="1.0"?>
<xmlRoot><Control Operate="Get">
<Mode><PatternNo>252</PatternNo>
</Mode>
</Control>
</xmlRoot>
0000   6e 6e 00 00 bb 00 00 00 fc 00 00 00


全灭控制
<?xml version="1.0"?>
<xmlRoot><Control Operate="Get">
<Mode><PatternNo>251</PatternNo>
</Mode>
</Control>
</xmlRoot>
0000   6e 6e 00 00 bb 00 00 00 fb 00 00 00

自适应控制
<?xml version="1.0"?>
<xmlRoot><Control Operate="Get">
<Mode><PatternNo>248</PatternNo>
</Mode>
</Control>
</xmlRoot>
0000   6e 6e 00 00 bb 00 00 00 f8 00 00 00


