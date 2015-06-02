#include<stdio.h>
#include<stdlib.h>
#include<string.h>

//xor chars in str with bytes in xor
void xor(unsigned char* input1, unsigned char* input2, int len, unsigned char *output) {
   int i;

   for (i = 0; i < len; i++) {
      output[i] = input1[i] ^ input2[i];
   }
}

int main(int argc, char *argv[]) {
   unsigned char* buffer1, *buffer2;
   unsigned char* tmpbuffer1[0x400];
   size_t insize1, insize2, outsize;
   FILE *infile1, *infile2, *outfile;
   char *infilename1, *infilename2, *outfilename;
   infilename1 = argv[1];
   infilename2 = argv[2];
   outfilename = argv[3];

   if (argc != 4) {
      printf("usage: decrypt infile1 infile2 outfile\n");
      return -1;
   }

   //read obfuscated file
   infile1 = fopen(argv[1], "rb");
   infile2 = fopen(argv[2], "rb");

   if (infile1 == NULL) {
      fputs("Can't open infile1", stderr);
      return -1;
   }

   if (infile2 == NULL) {
      fputs("Can't open infile2", stderr);
      return -1;
   }

   fseek(infile1, 0, SEEK_END);
   insize1 = ftell(infile1);
   rewind(infile1);

   fseek(infile2, 0, SEEK_END);
   insize2 = ftell(infile2);
   rewind(infile2);

   buffer1 = (unsigned char*) malloc(insize1);
   if (buffer1 == NULL) {
      fputs("memory error", stderr);
      exit(2);
   }

   buffer2 = (unsigned char*) malloc(insize2);
   if (buffer2 == NULL) {
      fputs("memory error", stderr);
      exit(2);
   }

   outsize = ((insize1 < insize2) ? insize1 : insize2);

   printf("Read \t%i bytes from %s\n", (int)fread(buffer1, 1, insize1, infile1), infilename1);
   fclose(infile1);

   printf("Read \t%i bytes from %s\n", (int)fread(buffer2, 1, insize2, infile2), infilename2);
   fclose(infile2);

   printf("XOR-ing file. Notices, we will take the smallest file and xor only till that position in the bigger file...\n");
   // we write the result of the XOR operation in buffer1, and leave buffer2 untouched
   xor(buffer1, buffer2, outsize, buffer1);

   outfile = fopen(argv[3], "wb");

   if (outfile == NULL) {
      fputs("cant open outfile", stderr);
      return -1;
   }

   printf("Wrote \t%i bytes\n", (int)fwrite(buffer1, 1, outsize, outfile));
   fclose(outfile);

   printf("Done, check the result in %s", outfilename);

   return 0;
}

