import sys,pprint
import random as rd
from gexf import Gexf
from lxml import *
import time
import requests
# test helloworld.gexf


"""
doc

attvalue
viz -> value
viz -> position
viz -> color

node_list
node_pos_list
node
"""

def GenerateGexf(InputNode,InputEdge, NodeTypeList,node_pos_list):
    gexf = Gexf("Gephi.org","A Web network")
    graph=gexf.addGraph("undirected","static","A Web network") 
    #atr1 = graph.addNodeAttribute('test1',type='integer',defaultValue='0')
    #Head
    print("Node" + str(len(InputNode))) #length of the data
    i = 0
    while i < len(InputNode):
    	tmp = graph.addNode(InputNode[i][0],InputNode[i][1])
    	#tmp.addAttribute(atr1,"1")
    	i = i + 1
    	pass

    print("Edge" + str(len(InputEdge)))
    i = 0
    while i < len(InputEdge):
    	graph.addEdge(i,InputEdge[i][0],InputEdge[i][1])
    	i = i + 1
    	pass 

    output_file=open("./data/data.gexf","w")
    #gexf.write(output_file)

    #Here is the position Test
    
    gexf_xml = gexf.getXML()  
    for gexf_elem in gexf_xml:  
        if gexf_elem.tag == 'graph':  
            for gexf_nodes_links in gexf_elem:  
                if gexf_nodes_links.tag == 'nodes':  
                    print "dealing with nodes viz"  
                    for node in gexf_nodes_links:  
                        tmp_id = node.get('id')
                        #node_id = node_id_list[tmp_id]  
                       	
                        #node_rgb = node_rgb_list[node_id]  
                        node_rgb = ["255","255","255"]
                        #size_value = str(node_size_list[node_id])  
                        size_value = NodeTypeList[int(tmp_id)]
                        size = etree.SubElement(node, '{%s}size' % gexf.viz)  
                        size.set('value', size_value)  

                        position = etree.SubElement(node, '{%s}position' % gexf.viz) 

                        node_pos = node_pos_list[int(size_value)-1]
                        position.set('x', str(int(node_pos[0]) + rd.randint(-60,60)))
                        position.set('y', str(int(node_pos[1]) + rd.randint(-60,60)))
                        #position.set('x', str(rd.randint(-60,60)))
                        #position.set('y', str(rd.randint(-60,20)))



                elif gexf_nodes_links.tag == 'edges':  
                    print "dealing with edges viz"  
                    for edge in gexf_nodes_links:  
                        src_tmp_id = edge.get('source')  
                        dst_tmp_id = edge.get('target')  
                        #src_id = node_id_list[src_tmp_id]
                        src_id = src_tmp_id  
                        #dst_id = node_id_list[dst_tmp_id]  
                        dst_id = dst_tmp_id

                        #weight = str(edge_weigh_lst[(src_id, dst_id)]) 
                        #weight = "3" 
                        #thickness = etree.SubElement(edge, '{%s}thickness' % gexf.viz)  
                        #thickness.set('value', weight)    
      
    output_file.write(etree.tostring(gexf_xml, pretty_print=True, encoding='utf-8', xml_declaration=True))  
    output_file.close()  

InputNode = []
InputEdge = []

NodeTypeList = []
node_pos_list = [["-50","-49"],["60","-66"],["0","50"],["0","0"]]
#this is the type of the Node
i = 0
while i < 7:
    requests.post('http://localhost:3001/mineBlock')
    InputNode.append([str(i),"ExName" + str(i)])
    InputEdge.append([str(rd.randint(0,len(InputNode)-1)) , str(rd.randint(0,len(InputNode)-1))])
    InputEdge.append([str(rd.randint(0,len(InputNode)-1)) , str(rd.randint(0,len(InputNode)-1))])
    NodeTypeList.append(str(rd.randint(1,4)))
    print(InputNode)
    print(InputEdge)
    GenerateGexf(InputNode,InputEdge,NodeTypeList,node_pos_list)
    time.sleep(3)
    #requests.post("www.baidu.com")
    i = i + 1
    pass
	