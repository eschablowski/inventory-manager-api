# ID Generation field

## Anatomy
Each byte is stuctured like so:
|             |                             Last Byte                             |                Data                 |
| :---------- | :---------------------------------------------------------------: | :---------------------------------: |
| Size        |                               1 bit                               |               7 bits                |
| Description | If set, denotes that this is the last bit of the generation byte. | Denotes the data stored in this bit |
| Example     |                                 0                                 |               0000000               |

> The generation field is recursive to accomodate for infinite generation length.
 
The actual generation value is generated by concatinating every piece of data together to generate a new integer. (Note: Two Bytes would only constitute 14 bits).