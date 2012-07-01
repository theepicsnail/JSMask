
/* FLMASK の 並べ替え列を得るテストプログラム */

/* このソースは自由に使って構いません。 T.Furumizo */

#include <stdio.h>
#include <stdlib.h>
#include <limits.h>	/* UINT_MAX */

typedef struct {
    int n;
    int id;
} FLS;

static int comp_fls(const void *s, const void *d)
{
    FLS *fs1 = (FLS *)s;
    FLS *fs2 = (FLS *)d;

    return fs1->id - fs2->id;
}


void GetFLTable(FLS *fs, int h, int w)
{
    int ct = 0, nc = h * w, i, d = 0, now;

    now = (h - 1) * w;
    while(1) {
	/* 右行き */
	if(w - d > 0)
	    for(i = 0; i < w - d; i++) {
		fs[ct++].n = now + i;
		if(ct == nc)
		    goto jp;
	    }
	/* 上行き */
	now = fs[ct - 1].n - w;
	d++;
	if(h - d > 0)
	    for(i = 0; i < h - d; i++) {
		fs[ct++].n = now - i * w;
		if(ct == nc)
		    goto jp;
	    }
	/* 左行き */
	now = fs[ct - 1].n - 1;
	if(w - d > 0)
	    for(i = 0; i < w - d; i++) {
		fs[ct++].n = now - i;
		if(ct == nc)
		    goto jp;
	    }
	/* 下行き */
	now = fs[ct - 1].n + w;
	d++;
	if(h - d > 0)
	    for(i = 0; i < h - d; i++) {
		fs[ct++].n = now + i * w;
		if(ct == nc)
		    goto jp;
	    }
	now = fs[ct - 1].n + 1;
    }
 jp:
    for(i = 0; i < nc; i++)
    	fs[i].id = fs[nc - i - 1].n;
    qsort(fs, nc, sizeof(FLS), comp_fls);
}

void main(int argc, char **argv)
{
    int i;
    int w = 3;
    int h = 4;
    FLS *fs;

    if(argc > 2) {
    	sscanf(argv[1], "%d", &h);
    	sscanf(argv[2], "%d", &w);
    	if(h <= 0)
    	    h = 4;
    	if(w <= 0)
    	    w = 3;
    }
    if((unsigned long)((long)h * w * sizeof(FLS)) > (unsigned long)UINT_MAX) {
        printf("malloc で取れるメモリ連続範囲を超えています。\n");
        exit(1);
    }
    fs = malloc(h * w * sizeof(FLS));
    if(!fs) {
    	printf("no memory ....\n");
    	exit(1);
    }

    GetFLTable(fs, h, w);

    for(i = 0; i < h * w; i++) {
	if(i % w == 0)
	    putchar('\n');
	printf("%4d", fs[i].n + 1);
    }
    putchar('\n');
    free(fs);
    exit(0);
}
