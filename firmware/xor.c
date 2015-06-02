#include<stdio.h>
#include<stdlib.h>
#include<string.h>

//xor chars in str with xorchar
void xors(unsigned char* bytes, int len, char xorchar, char skip) {
   int i;

   for (i = 0; i < len; i+=skip) {
      bytes[i] = bytes[i] ^ xorchar;
   }
}

int main(int argc, char *argv[]) {
   unsigned char* buffer;
   unsigned char* tmpbuffer[0x400];
   size_t insize;
   FILE *infile, *outfile;
   char *infilename, *outfilename;
   int offset;

   if (argc < 4) {
      printf("Usage: %s infile outfile offset ([0x??]*) \n", argv[0]);
      return -1;
   }
   infilename = argv[1];
   outfilename = argv[2];
   offset = strtol(argv[3], NULL, 0);

   int argc_offset = 4;
   int xor_cnt = argc - argc_offset;
   unsigned char xor_buffer[xor_cnt];
   int argi = argc_offset;
   for (; argi < argc; argi++) {
      // using 0x.. will automatically make it interpret hexadecimally
      xor_buffer[argi-argc_offset] = strtol(argv[argi], NULL, 0);
   }

   infile = fopen(infilename, "rb");

   if (infile == NULL) {
      fputs("cant open infile", stderr);
      return -1;
   }

   fseek(infile, 0, SEEK_END);
   insize = ftell(infile);
   rewind(infile);

   buffer = (unsigned char*) malloc(insize);
   if (buffer == NULL) {
      fputs("memory error", stderr);
      exit(2);
   }

   printf("read \t%i bytes\n", (int)fread(buffer, 1, insize, infile));
   fclose(infile);

   printf("descrambling file ...\n");
   int i;
   for (i = 0; i < xor_cnt; i++) {
      xors(buffer + offset + i, insize - (offset + 1), xor_buffer[i], xor_cnt);
   }
   int outsize = insize;

   outfile = fopen(outfilename, "wb");

   if (outfile == NULL) {
      fputs("cant open outfile", stderr);
      return -1;
   }

   printf("wrote \t%i bytes\n", (int)fwrite(buffer, 1, outsize, outfile));
   fclose(outfile);

   printf("done, good luck");

   return 0;
}

