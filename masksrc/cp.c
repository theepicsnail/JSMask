#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <ctype.h>

#define CP_MAX	16  /* CP code length max */

static unsigned char CPTbl[] = {
    0x10, 0x17, 0x13, 0x15, 0x09,
    0x08, 0x0a, 0x14, 0x06, 0x05,
    0x16, 0x02, 0x0d, 0x03, 0x01,
    0x04, 0x19, 0x0c, 0x0f, 0x0e,
    0x12, 0x07, 0x0b, 0x18, 0x11, 0x1a
};

int *tbl;
int ntbl = 0;
char *code;

typedef struct {
    int n;
    char flg;
} CPS;

CPS *cps;

static void GetCPTbl(int nTbl, char *CPcode, int *tbl, CPS *cps)
{
    int i, k, vl1, vl2, len;

    for(i = 0; i < nTbl; i++) {
        tbl[i] = -1;
        cps[i].n = i;
        cps[i].flg = 0;
    }
    len = strlen(CPcode);
    vl1 = nTbl - 1;
    vl2 = len + nTbl % len;
    for(k = 0; k < nTbl; k++) {
        vl1 = CPTbl[CPcode[k % len] - 'A'] + vl1 + vl2;
        if(vl1 >= nTbl)
            vl1 %= nTbl;
         while(tbl[vl1] != -1) {
            if(k & 01) {
                if(vl1 == 0)
                    vl1 = nTbl;
                vl1--;
            }
            else {
                if(++vl1 >= nTbl)
                    vl1 = 0;
            }
        }
        tbl[vl1] = k;
        vl2++;
    }
    for(i = 0, k = nTbl - 1; i < k; i++, k--) {
        cps[tbl[i]].n = tbl[k];
        cps[tbl[k]].n = tbl[i];
        if((tbl[i] ^ tbl[k]) & 0x01)
            cps[tbl[i]].flg = cps[tbl[k]].flg = 1;
    }
}


void main(int argc, char **argv)
{
    char *p;
    int len;
    int i;

    if(argc < 3) {
        printf("CP: usage CP code block_num\n  exsample: CP sample 10\n");
        exit(1);
    }
    code = argv[1];
    ntbl = atoi(argv[2]);
    len = strlen(code);
    for(p = code; *p; p++) {
        if(!isalpha(*p)) {
            printf(" Code is alphabet only!\n");
            exit(1);
        }
        if(islower(*p))
            *p = toupper(*p);
    }
    if(len > CP_MAX) {
        printf(" Code length  %d upper!!\n", CP_MAX);
        exit(1);
    }
    tbl = malloc(sizeof(int) * ntbl);
    cps = malloc(sizeof(CPS) * ntbl);
    if(!tbl || !cps) {
        printf("No memory!!\n");
        if(tbl)
            free(tbl);
        exit(1);
    }
    GetCPTbl(ntbl, code, tbl, cps);
    
    for(i = 0; i < ntbl; i++) {
        printf("%4d -%c,", cps[i].n, cps[i].flg ? 'o': 'x');
    }
    putchar('\n');
    free(tbl);
    free(cps);
    exit(0);
}
