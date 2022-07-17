import {ethers} from 'ethers';
import Onboard from 'bnc-onboard';
import {useEffect, useState} from "react";
import {createContainer} from "unstated-next";
import {API, WalletInitOptions, WalletModule} from "bnc-onboard/dist/src/interfaces";
import { Web3Provider } from '@ethersproject/providers';

export const networkId = process.env.NEXT_PUBLIC_RPC_NETWORK