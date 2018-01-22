#include <wiringPi.h>
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <math.h>

int xfer(int tx, int CLK_PIN, int MISO_PIN, int MOSI_PIN, int CS_PIN) {
    unsigned char t;  
    unsigned char shiftin=0; 
    digitalWrite (CS_PIN, 0);
    digitalWrite (CLK_PIN, 0);
    for (t=0; t < 8; t++) { 
        if ((tx & 0x80) == 0) 
            digitalWrite (MOSI_PIN, 0);
        else 
            digitalWrite (MOSI_PIN, 1);
        delay(1);
        digitalWrite (CLK_PIN, 1);
        tx <<= 1;    //shift left one bit 
        shiftin <<= 1; //shift left one bit 
        if (digitalRead(MISO_PIN) == 1) 
            shiftin |= 1;
        delay(1);
        digitalWrite (CLK_PIN, 0);
        
    } 
    digitalWrite (CS_PIN, 1);
    return shiftin;
}


int main (int argc, char *argv[])
{
    int SPI_CLK, SPI_MISO, SPI_MOSI, SPI_CS, CHANNEL;
    if (argc < 6) {
        printf("Incomplete number of arguments.");
        exit(EXIT_FAILURE);
    }
    SPI_CLK = atoi(argv[1]);
    SPI_MISO = atoi(argv[2]);
    SPI_MOSI = atoi(argv[3]);
    SPI_CS = atoi(argv[4]);

    CHANNEL = atoi(argv[5]);

    wiringPiSetup ();

    pinMode (SPI_CLK, OUTPUT) ;
    pinMode (SPI_MISO, INPUT) ;
    pinMode (SPI_MOSI, OUTPUT) ;
    pinMode (SPI_CS, OUTPUT) ;


    // Get timestamp.
    struct timespec spec;
    clock_gettime(CLOCK_REALTIME, &spec);
    long            ms; // Milliseconds
    time_t          s;  // Seconds
    s  = spec.tv_sec;
    ms = round(spec.tv_nsec / 1.0e6); // Convert nanoseconds to milliseconds
    if (ms > 999) {
        s++;
        ms = 0;
    }
    float value = 5.0;

    int response = xfer(0b10000001 + (CHANNEL << 4), SPI_CLK, SPI_MISO, SPI_MOSI, SPI_CS);
    printf("%i -> %i\n",0b10000001 + (CHANNEL << 4), response);
    response = xfer(0b0, SPI_CLK, SPI_MISO, SPI_MOSI, SPI_CS);
    printf("%i -> %i\n",0b0, response);
    response = xfer(0b0, SPI_CLK, SPI_MISO, SPI_MOSI, SPI_CS);
    printf("%i -> %i\n",0b0, response);
    response = xfer(0b0, SPI_CLK, SPI_MISO, SPI_MOSI, SPI_CS);
    printf("%i -> %i\n",0b0, response);

    // Print results.
    printf("%i.%03ld,%i,%f\n", (int)s, ms, CHANNEL, value); 
    return 0 ;
}