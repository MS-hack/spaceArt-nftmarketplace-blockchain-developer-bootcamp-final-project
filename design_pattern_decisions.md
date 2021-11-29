Design patterns used:

1)Inter-Contract Execution: SwapTokens Contract calls TokenA and TokenB functions by importing them (aka dependency injection).

2-Inheritance and Interfaces: inherit from @openzeppelin/contracts/token/ERC20/ERC20.sol contract.



3- Categories of NFT Design Patterns
The NFT Design Patterns are organized by categories that are predominantly creator/collector/markeplace


4-index of NFT Design Patterns lists the patterns with top-level category patterns first followed by the most common child patterns. Each pattern provides links to the pattern's immediate hierarchy (direct parent pattern and direct child patterns) and to other related patterns

5-.State Machine addItem(....) is avaialble only after file has been uploaded to IPFS and the frontend state of next.js has the hash stored in. Only then can the hash be passed on to the contract call. Some functions like getItem(uint id) are only availaible after the first token has been minted. It requires tokenID