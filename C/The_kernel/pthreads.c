#include <stdio.h>
#include <pthread.h>
#define NTHREADS 10;

pthread_t threads[NTHREADS]

struct hello_params
{
    int i; 
    int j;
    int *name;
};

void *go (void *n) {
    printf();

}