
/* メコマスクの並べ替え順を得るテストプログラム */

/* このソースは自由に使って構いません。 T.Furumizo */

#include <stdio.h>
#include <stdlib.h>

#include "mekorand.h"

#define MX_MTBL		(sizeof(mekornd) / sizeof(unsigned short))

typedef struct {
    int n;
    unsigned short int r;
} MKT;


static int comp_mt(const void *s, const void *d)
{
    MKT *mt1 = (MKT *)s;
    MKT *mt2 = (MKT *)d;

    return (int)(short)(mt1->r - mt2->r);
}


void main(int argc, char **argv)
{
    int n = 10, i;
    MKT *mt;

    if(argc > 1) {
        sscanf(argv[1], "%d", &n);
        if(n <= 0 || n > MX_MTBL)
            n = 10;
    }
    mt = malloc(sizeof(MKT) * n);
    if(!mt) {
        printf("no memory!\n");
        exit(1);
    }
    for(i = 0; i < n; i++) {
        mt[i].r = mekornd[i];
        mt[i].n = i + 1;
    }
    qsort(mt, n, sizeof(MKT), comp_mt);

    for(i = 0; i < n; i++)
    	printf("%4d", mt[i].n);
    putchar ('\n');
    free(mt);
    exit(0);
}
