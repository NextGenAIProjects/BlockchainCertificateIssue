// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CertificateRegistry {
    event CertificateIssued(string certId, string candidateName, string courseName, uint256 timestamp);
    
    struct Certificate {
        string candidateName;
        string courseName;
        bool isValid;
        bool exists;
    }

    mapping(bytes32 => Certificate) public certificates;
    address public admin;

    constructor() {
        admin = msg.sender;
    }

    function issueCertificate(string memory _certId, string memory _name, string memory _course) public {
        require(msg.sender == admin, "Only admin can issue");
        bytes32 certHash = keccak256(abi.encodePacked(_certId));
        
        // check for duplicate
        require(!certificates[certHash].exists, "Certificate already exists");
        
        certificates[certHash] = Certificate(_name, _course, true, true);
        // Emit the event for the table
        emit CertificateIssued(_certId, _name, _course, block.timestamp);
    }

    function verifyCertificate(string memory _certId) public view returns (string memory, string memory, bool) {
        bytes32 certHash = keccak256(abi.encodePacked(_certId));
        Certificate memory cert = certificates[certHash];
        return (cert.candidateName, cert.courseName, cert.isValid);
    }
}