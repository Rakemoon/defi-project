// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Scolarship {

    struct Participant {
        uint8 approved;
        address participant;
    }

    function apply() public virtual {}

    function approve(uint[] memory id) public virtual {}

    function vote(uint id, uint amount) {}

    function withdraw(uint amount) {}
}

