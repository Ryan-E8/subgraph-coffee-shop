
import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  NftBurned as NftBurnedEvent,
  NftMinted as NftMintedEvent,
  Transfer as TransferEvent
} from "../generated/CoffeeNFT/CoffeeNFT"
import { NftBurned,NftMinted,NftTransferred,NftOwner } from "../generated/schema";


export function handleNftBurned(event: NftBurnedEvent): void {
  // Save that event in our graph
  // update our owned items

  // get or create an NftOwner object
  // each item need a unique ID

  // NftBurnedEvent: Just the raw event
  // NftBurnedObject: What we save
  let nftBurned = NftBurned.load(getIdFromEventParams(event.params.tokenId, event.params.holder))
  let nftOwner = NftOwner.load(getIdFromEventParams(event.params.tokenId, event.params.holder))
  if (!nftBurned) {
    nftBurned = new NftBurned(
      getIdFromEventParams(event.params.tokenId, event.params.holder)
    )
  }
  nftBurned.holder = event.params.holder
  nftBurned.tokenId = event.params.tokenId

  nftOwner!.owner = Address.fromString("0x000000000000000000000000000000000000dEaD")

  nftBurned.save()
  nftOwner!.save()
}

export function handleNftMinted(event: NftMintedEvent): void {
  let nftMinted = NftMinted.load(getIdFromEventParams(event.params.tokenId, event.params.buyer))
  let nftOwner = NftOwner.load(getIdFromEventParams(event.params.tokenId, event.params.buyer))

  if (!nftMinted) {
    nftMinted = new NftMinted(
      getIdFromEventParams(event.params.tokenId, event.params.buyer)
    )
  }
  if(!nftOwner) {
    nftOwner = new NftOwner(
      getIdFromEventParams(event.params.tokenId, event.params.buyer)
    )
  }
  nftMinted.buyer = event.params.buyer
  nftOwner.owner = event.params.buyer

  nftMinted.tokenId = event.params.tokenId
  nftOwner.tokenId = event.params.tokenId

  nftMinted.save()
  nftOwner.save()
}

export function handleTransfer(event: TransferEvent): void {
  let nftTransferred = NftTransferred.load(getIdFromEventParams(event.params.tokenId, event.params.to))
  let nftOwner = NftOwner.load(getIdFromEventParams(event.params.tokenId, event.params.to))

  if (!nftTransferred) {
    nftTransferred = new NftTransferred(
      getIdFromEventParams(event.params.tokenId, event.params.to)
    )
  }

  nftTransferred.tokenId = event.params.tokenId
  nftTransferred.oldOwner = event.params.from
  nftTransferred.newOwner = event.params.to

  nftOwner!.owner = event.params.to

  nftTransferred.save()
  nftOwner!.save()
}

function getIdFromEventParams(tokenId: BigInt, nftOwner: Address): string {
  return tokenId.toHexString() + nftOwner.toHexString()
}
